import React, { useState } from 'react';
import { Newspaper } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function NewsSection() {
  const { language, t, news } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', ...new Set(news.map((item) => item.category))];
  const filteredNews =
    selectedCategory === 'ALL'
      ? news
      : news.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
            <Newspaper className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{t.universityNews}</h1>
            <p className="text-xs text-slate-500">
              {filteredNews.length} {t.announcements}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {filteredNews.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-emerald-200"
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                {item.category}
              </span>
              <span className="text-slate-500">{item.date}</span>
            </div>

            <h2 className="mt-3 text-base font-bold text-slate-900">
              {item.title[language] || item.title.en}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {item.summary[language] || item.summary.en}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}