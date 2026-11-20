import React from 'react';
import { Images } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PhotosSection() {
  const { language, t, photos } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Images className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{t.universityPhotos}</h1>
          <p className="text-xs text-slate-500">{photos.length} photos</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <figure
            key={photo.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
          >
            <img
              src={photo.url}
              alt={photo.title[language] || photo.title.en}
              className="h-56 w-full object-cover"
            />
            <figcaption className="p-4 text-sm font-bold text-slate-900">
              {photo.title[language] || photo.title.en}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}