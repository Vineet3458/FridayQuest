'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/api';

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  city?: string;
  campus?: string;
}

export function useGeolocation() {
  const [coordinates, setCoordinates] = useState<UserCoordinates | null>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reverse geocode coordinates to friendly city / campus
  const resolveLocationName = async (lat: number, lon: number): Promise<{ city: string; campus: string }> => {
    // Check office campuses proximity (Noida, Bengaluru, Gurgaon, Mumbai)
    const campuses = [
      { name: 'Noida HQ Campus', city: 'Noida, India', lat: 28.5355, lon: 77.391 },
      { name: 'Gurugram Tech Park', city: 'Gurugram, India', lat: 28.4595, lon: 77.0266 },
      { name: 'Bengaluru Innovation Center', city: 'Bengaluru, India', lat: 12.9716, lon: 77.5946 },
      { name: 'Mumbai Financial Hub', city: 'Mumbai, India', lat: 19.076, lon: 72.8777 },
    ];

    let closestCampus = 'Noida HQ Campus';
    let closestCity = 'Noida, India';
    let minDistance = Infinity;

    for (const c of campuses) {
      const d = Math.hypot(lat - c.lat, lon - c.lon);
      if (d < minDistance) {
        minDistance = d;
        closestCampus = c.name;
        closestCity = c.city;
      }
    }

    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      if (res.ok) {
        const data = await res.json();
        const cityPart = data.city || data.locality || data.principalSubdivision || closestCity;
        const countryPart = data.countryName || 'India';
        return {
          city: `${cityPart}, ${countryPart}`,
          campus: minDistance < 1.0 ? closestCampus : `${cityPart} Office`,
        };
      }
    } catch {
      // Fallback to closest known office campus
    }

    return { city: closestCity, campus: closestCampus };
  };

  const requestLocationPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setPermissionState('unsupported');
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setPermissionState('granted');

        const { city, campus } = await resolveLocationName(lat, lon);
        const locationData: UserCoordinates = { latitude: lat, longitude: lon, city, campus };
        setCoordinates(locationData);
        setLoading(false);

        // Save detected location to backend user profile
        try {
          await apiRequest('/users/me', {
            method: 'PATCH',
            body: JSON.stringify({
              location: {
                latitude: lat,
                longitude: lon,
                city,
                campus,
              },
            }),
          });
        } catch (saveErr) {
          console.error('Failed to sync user location to database:', saveErr);
        }
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionState('denied');
          setError('Location permission was denied. You can enable it in your browser address bar.');
        } else {
          setError(err.message || 'Unable to retrieve location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000 * 60 * 5, // 5 min cache
      }
    );
  }, []);

  // Request browser location permission automatically on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions
          .query({ name: 'geolocation' as PermissionName })
          .then((res) => {
            setPermissionState(res.state as any);
            if (res.state === 'granted' || res.state === 'prompt') {
              requestLocationPermission();
            }
            res.onchange = () => {
              setPermissionState(res.state as any);
              if (res.state === 'granted') {
                requestLocationPermission();
              }
            };
          })
          .catch(() => {
            requestLocationPermission();
          });
      } else {
        requestLocationPermission();
      }
    }
  }, [requestLocationPermission]);

  return {
    coordinates,
    permissionState,
    loading,
    error,
    requestLocationPermission,
  };
}

