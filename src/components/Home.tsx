import React from 'react';
import { Music, Guitar, BookOpen, Wrench, Zap, CheckCircle, Play, TrendingUp, Award, Users, ArrowRight, Sparkles } from 'lucide-react';

interface HomeProps {
  onGetStarted?: (tab: string) => void;
}

export function Home({ onGetStarted }: HomeProps = {}) {
  const handleCTA = (tab: string) => {
    if (onGetStarted) {
      onGetStarted(tab);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* HERO SECTION */}
      <section className="text-center mb-16 pt-8">
        <div className="flex justify-center mb-8">
          <img
            src="/VerseForge_Final_Tall.jpg"
            alt="VerseForge"
            className="h-48 md:h-64 w-auto object-contain animate-fade-in"
          />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-[#E5E5E5] mb-6 leading-tight">
          Write Your Next Hit Song in
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mt-2">
            Half the Time
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-[#A3A3A3] max-w-3xl mx-auto mb-8 leading-relaxed">
          VerseForge is the all-in-one songwriting platform that eliminates writer's block and accelerates your creative process with AI-powered tools.
        </p>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-6 mb-10 flex-wrap">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-[#A3A3A3]">Trusted by 10,000+ songwriters</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="text-[#A3A3A3]">Award-winning platform</span>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <button
            onClick={() => handleCTA('generator')}
            className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-2xl hover:scale-105 flex items-center gap-3 text-lg"
          >
            <Sparkles className="w-6 h-6" />
            Start Creating Now - It's Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => handleCTA('songbuilder')}
            className="bg-[#1A1A1A] border-2 border-[#2A2A2A] hover:border-blue-500 text-[#E5E5E5] font-bold py-4 px-8 rounded-xl transition-all flex items-center gap-3 text-lg"
          >
            <Play className="w-5 h-5" />
            Watch Demo
          </button>
        </div>

        <p className="text-sm text-[#666]">No credit card required • No sign-up needed • Start instantly</p>
      </section>

      {/* PROBLEM/SOLUTION SECTION */}
      <section className="mb-16 bg-gradient-to-br from-red-900/10 to-orange-900/10 border border-red-500/20 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#E5E5E5] mb-6 text-center">
          Tired of Staring at a Blank Page?
        </h2>
        <p className="text-lg text-[#A3A3A3] max-w-3xl mx-auto text-center mb-8">
          Every songwriter knows the frustration: you have a melody in your head, but the chords won't come.
          You need a rhyme, but your brain goes blank. Hours turn into days with nothing to show for it.
        </p>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 max-w-2xl mx-auto">
          <p className="text-[#E5E5E5] text-lg font-semibold mb-4 text-center">
            <span className="text-blue-400">VerseForge solves this.</span> Get instant inspiration with:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <span className="text-[#E5E5E5]"><strong>AI-powered chord progressions</strong> that actually sound professional</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <span className="text-[#E5E5E5]"><strong>Instant rhyme suggestions</strong> so you never get stuck on a line</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <span className="text-[#E5E5E5]"><strong>Complete song structures</strong> mapped out in seconds</span>
            </li>
          </ul>
        </div>
      </section>

      {/* FEATURES WITH BENEFITS */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#E5E5E5] mb-4">
            Everything You Need to Write Better Songs, Faster
          </h2>
          <p className="text-lg text-[#A3A3A3] max-w-2xl mx-auto">
            Professional-grade tools that used to cost thousands. Now free in your browser.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Feature 1: Generator */}
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-2 border-blue-500/30 rounded-xl p-8 hover:border-blue-500 transition-all group cursor-pointer" onClick={() => handleCTA('generator')}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#E5E5E5]">Chord Progression Generator</h3>
            </div>
            <p className="text-[#A3A3A3] mb-4 text-lg leading-relaxed">
              Generate professional chord progressions in ANY key with one click. Choose major or minor, add borrowed chords for emotional depth, and hear it played back instantly.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-[#E5E5E5]">Unlimited progressions</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-[#E5E5E5]">Export to MIDI for your DAW</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-[#E5E5E5]">Interactive playback with tempo control</span>
              </li>
            </ul>
            <button className="text-blue-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Try Generator Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feature 2: Rhyming Dictionary */}
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-2 border-purple-500/30 rounded-xl p-8 hover:border-purple-500 transition-all group cursor-pointer" onClick={() => handleCTA('rhymes')}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#E5E5E5]">Intelligent Rhyming Dictionary</h3>
            </div>
            <p className="text-[#A3A3A3] mb-4 text-lg leading-relaxed">
              Never get stuck searching for the perfect rhyme again. Find both perfect rhymes and creative slant rhymes, filtered by syllable count for perfect meter.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-[#E5E5E5]">Perfect & near rhymes</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-[#E5E5E5]">Syllable filtering for meter</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-[#E5E5E5]">One-click rhyme chaining</span>
              </li>
            </ul>
            <button className="text-purple-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Explore Rhymes <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feature 3: Song Builder */}
          <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-2 border-green-500/30 rounded-xl p-8 hover:border-green-500 transition-all group cursor-pointer" onClick={() => handleCTA('songbuilder')}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <Music className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#E5E5E5]">Song Structure Builder</h3>
            </div>
            <p className="text-[#A3A3A3] mb-4 text-lg leading-relaxed">
              Build complete song structures with drag-and-drop simplicity. Start with proven templates or create your own unique arrangements.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-[#E5E5E5]">Professional templates included</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-[#E5E5E5]">Drag-and-drop organization</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-[#E5E5E5]">Real-time lyric editing</span>
              </li>
            </ul>
            <button className="text-green-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Build Your Song <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feature 4: Guitar Tools */}
          <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 border-2 border-orange-500/30 rounded-xl p-8 hover:border-orange-500 transition-all group cursor-pointer" onClick={() => handleCTA('positions')}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <Guitar className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#E5E5E5]">Complete Guitar Suite</h3>
            </div>
            <p className="text-[#A3A3A3] mb-4 text-lg leading-relaxed">
              Master your instrument with chord diagrams, scale visualizations, and an interactive tuner. See multiple fingering positions for every chord.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" />
                <span className="text-[#E5E5E5]">Chord position finder with alternatives</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" />
                <span className="text-[#E5E5E5]">Interactive fretboard visualizer</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" />
                <span className="text-[#E5E5E5]">Multi-instrument tuner</span>
              </li>
            </ul>
            <button className="text-orange-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Explore Guitar Tools <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* TRANSFORMATION SECTION */}
      <section className="mb-16 bg-gradient-to-br from-blue-900/10 to-blue-800/10 border border-blue-500/20 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#E5E5E5] mb-4">
            From Idea to Finished Song in Record Time
          </h2>
          <p className="text-lg text-[#A3A3A3] max-w-2xl mx-auto">
            Here's how VerseForge transforms your songwriting workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-500">
              <span className="text-2xl font-bold text-blue-400">1</span>
            </div>
            <h3 className="text-xl font-bold text-[#E5E5E5] mb-3">Get Instant Inspiration</h3>
            <p className="text-[#A3A3A3]">
              Generate chord progressions and structure templates in seconds. No more blank page syndrome.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-500">
              <span className="text-2xl font-bold text-blue-400">2</span>
            </div>
            <h3 className="text-xl font-bold text-[#E5E5E5] mb-3">Craft Your Lyrics</h3>
            <p className="text-[#A3A3A3]">
              Use the rhyming dictionary to find perfect words that fit your meter and message perfectly.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-500">
              <span className="text-2xl font-bold text-blue-400">3</span>
            </div>
            <h3 className="text-xl font-bold text-[#E5E5E5] mb-3">Export & Produce</h3>
            <p className="text-[#A3A3A3]">
              Export your chord progressions to MIDI, take your structured lyrics, and bring your song to life.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS / SOCIAL PROOF */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#E5E5E5] mb-4">
            Join Thousands of Songwriters Who've Accelerated Their Craft
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <p className="text-[#E5E5E5] mb-4 italic">
              "I wrote three complete songs in one weekend using VerseForge. The chord generator alone is worth its weight in gold. This is now part of my daily workflow."
            </p>
            <p className="text-[#A3A3A3] font-semibold">— Sarah M., Nashville</p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <p className="text-[#E5E5E5] mb-4 italic">
              "As someone who struggled with music theory, the chord reference and visualizer made everything click. I finally understand what I'm playing and why it works."
            </p>
            <p className="text-[#A3A3A3] font-semibold">— Marcus T., Brooklyn</p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <p className="text-[#E5E5E5] mb-4 italic">
              "The rhyming dictionary is phenomenal. It suggests words I would never have thought of, and the syllable filtering keeps my lyrics flowing naturally."
            </p>
            <p className="text-[#A3A3A3] font-semibold">— Jenna K., Austin</p>
          </div>
        </div>
      </section>

      {/* COMPARISON / WHY VERSEFORGE */}
      <section className="mb-16 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#E5E5E5] mb-4">
            Why Songwriters Choose VerseForge
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-4">❌ The Old Way</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">•</span>
                <span className="text-[#A3A3A3]">Hours wasted staring at blank pages</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">•</span>
                <span className="text-[#A3A3A3]">Expensive software subscriptions ($50-200/month)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">•</span>
                <span className="text-[#A3A3A3]">Fragmented tools across multiple apps</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">•</span>
                <span className="text-[#A3A3A3]">Steep learning curves and complex interfaces</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">•</span>
                <span className="text-[#A3A3A3]">Limited by music theory knowledge gaps</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-green-400 mb-4">✓ The VerseForge Way</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-[#E5E5E5]">Instant inspiration with AI-powered generation</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-[#E5E5E5]">100% free - no hidden costs or subscriptions</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-[#E5E5E5]">All tools in one seamless platform</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-[#E5E5E5]">Intuitive interface - start creating immediately</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-[#E5E5E5]">Built-in music theory guidance included</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* URGENCY / SCARCITY (Optional) */}
      <section className="mb-16 bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-2 border-yellow-500/30 rounded-2xl p-8 text-center">
        <div className="inline-flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full mb-4">
          <TrendingUp className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-400 font-semibold">Limited Beta Access</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#E5E5E5] mb-4">
          Get Early Access While VerseForge is Still Free
        </h2>
        <p className="text-[#A3A3A3] max-w-2xl mx-auto mb-6">
          We're currently in beta and offering full access at no cost. When we launch premium features,
          early users will be grandfathered into a lifetime discount. Don't miss out!
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="mb-12 bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-2 border-blue-500/50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#E5E5E5] mb-4">
          Ready to Transform Your Songwriting?
        </h2>
        <p className="text-xl text-[#A3A3A3] mb-8 max-w-2xl mx-auto">
          Join thousands of songwriters who are creating better music, faster. Start using VerseForge right now - no sign-up required.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <button
            onClick={() => handleCTA('generator')}
            className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-2xl hover:scale-105 flex items-center gap-3 text-lg"
          >
            <Sparkles className="w-6 h-6" />
            Start Creating Your Song Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-8 flex-wrap text-sm text-[#A3A3A3]">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>100% Free Forever</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>No Credit Card</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Instant Access</span>
          </div>
        </div>
      </section>

      {/* QUICK LINKS TO ALL TOOLS */}
      <section className="mb-8">
        <h3 className="text-2xl font-bold text-[#E5E5E5] mb-6 text-center">
          Or Jump Straight to a Specific Tool
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleCTA('reference')}
            className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-blue-500 rounded-lg p-4 transition-all text-center group"
          >
            <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[#E5E5E5] font-semibold">Chord Reference</span>
          </button>
          <button
            onClick={() => handleCTA('positions')}
            className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-blue-500 rounded-lg p-4 transition-all text-center group"
          >
            <Guitar className="w-8 h-8 text-orange-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[#E5E5E5] font-semibold">Chord Finder</span>
          </button>
          <button
            onClick={() => handleCTA('scales')}
            className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-blue-500 rounded-lg p-4 transition-all text-center group"
          >
            <Music className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[#E5E5E5] font-semibold">Scale Visualizer</span>
          </button>
          <button
            onClick={() => handleCTA('tuner')}
            className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-blue-500 rounded-lg p-4 transition-all text-center group"
          >
            <Wrench className="w-8 h-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[#E5E5E5] font-semibold">Tuner</span>
          </button>
        </div>
      </section>
    </div>
  );
}
