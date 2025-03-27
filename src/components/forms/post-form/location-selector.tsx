'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { prefectures, cities } from '@/lib/utils/location-data';
import { Select } from '@/components/ui/select';

export function LocationSelector() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const [selectedPref, setSelectedPref] = useState<string | null>(null);
  const prefectureValue = watch('prefecture');
  
  useEffect(() => {
    if (prefectureValue && prefectureValue !== selectedPref) {
      setSelectedPref(prefectureValue);
    }
  }, [prefectureValue]);
  
  const handlePrefectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prefId = e.target.value;
    setSelectedPref(prefId);
    setValue('city', ''); // 都道府県が変更されたら市区町村をリセット
  };

  const availableCities = selectedPref ? cities[selectedPref] || [] : [];

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700">
          都道府県
        </label>
        <Select
          id="prefecture"
          {...register('prefecture')}
          onChange={handlePrefectureChange}
          error={!!errors.prefecture}
          className="mt-1"
        >
          <option value="">選択してください</option>
          {prefectures.map((pref) => (
            <option key={pref.id} value={pref.id}>
              {pref.name}
            </option>
          ))}
        </Select>
        {errors.prefecture && (
          <p className="mt-1 text-xs text-red-500">{errors.prefecture.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          市区町村
        </label>
        <Select
          id="city"
          {...register('city')}
          disabled={!selectedPref}
          error={!!errors.city}
          className="mt-1"
        >
          <option value="">選択してください</option>
          {availableCities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </Select>
        {errors.city && (
          <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
        )}
      </div>

      <div className="text-xs text-gray-500">
        市区町村、駅どちらかは必須です。
      </div>
    </div>
  );
}