'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { railways, stations } from '@/lib/utils/location-data';
import { Select } from '@/components/ui/select';

export function StationSelector() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const [selectedRailway, setSelectedRailway] = useState<string | null>(null);
  const railwayValue = watch('railway');
  
  useEffect(() => {
    if (railwayValue && railwayValue !== selectedRailway) {
      setSelectedRailway(railwayValue);
    }
  }, [railwayValue]);
  
  const handleRailwayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const railwayId = e.target.value;
    setSelectedRailway(railwayId);
    setValue('station', ''); // 路線が変更されたら駅をリセット
  };

  const availableStations = selectedRailway ? stations[selectedRailway] || [] : [];

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="railway" className="block text-sm font-medium text-gray-700">
          路線
        </label>
        <Select
          id="railway"
          {...register('railway')}
          onChange={handleRailwayChange}
          error={!!errors.railway}
          className="mt-1"
        >
          <option value="">選択してください</option>
          {railways.map((railway) => (
            <option key={railway.id} value={railway.id}>
              {railway.name}
            </option>
          ))}
        </Select>
        {errors.railway && (
          <p className="mt-1 text-xs text-red-500">{errors.railway.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="station" className="block text-sm font-medium text-gray-700">
          駅
        </label>
        <Select
          id="station"
          {...register('station')}
          disabled={!selectedRailway}
          error={!!errors.station}
          className="mt-1"
        >
          <option value="">選択してください</option>
          {availableStations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </Select>
        {errors.station && (
          <p className="mt-1 text-xs text-red-500">{errors.station.message}</p>
        )}
      </div>

      <div className="text-xs text-gray-500">
        市区町村、駅どちらかは必須です。
      </div>
    </div>
  );
}