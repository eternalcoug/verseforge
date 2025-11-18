import React from 'react';
import { Music, Guitar, BookOpen, Wrench } from 'lucide-react';

export function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-center mb-12 pt-8">
        <img
          src="/VerseForge_Final_Tall.jpg"
          alt="VerseForge"
          className="h-64 md:h-80 w-auto object-contain"
        />
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#E5E5E5] mb-4">
          Welcome to VerseForge
        </h1>
        <p className="text-xl text-[#A3A3A3] max-w-2xl mx-auto">
          Your complete toolkit for songwriting, chord progressions, and musical creativity
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 hover:border-blue-500 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#E5E5E5]">Chord Generator</h2>
          </div>
          <p className="text-[#A3A3A3]">
            Generate unique chord progressions in any key with customizable line types and borrowed chords. Perfect for songwriting inspiration.
          </p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 hover:border-blue-500 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Guitar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#E5E5E5]">Guitar Tools</h2>
          </div>
          <p className="text-[#A3A3A3]">
            Explore chord positions, visualize scales on the fretboard, and use our interactive tuner for multiple instruments.
          </p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 hover:border-blue-500 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#E5E5E5]">Lyric Tools</h2>
          </div>
          <p className="text-[#A3A3A3]">
            Find perfect rhymes with our comprehensive rhyming dictionary and build complete song structures with ease.
          </p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 hover:border-blue-500 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#E5E5E5]">Reference Library</h2>
          </div>
          <p className="text-[#A3A3A3]">
            Access comprehensive chord diagrams, fingerings, and music theory references to enhance your musical knowledge.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-[#E5E5E5] mb-4">
          Get Started
        </h3>
        <p className="text-[#A3A3A3] mb-6">
          Use the navigation above to explore all of VerseForge's powerful tools and start creating music today.
        </p>
      </div>
    </div>
  );
}
