import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, Trophy, Shield, MapPin, Users } from "lucide-react";
import TeamCrest from "../components/common/TeamCrest";
import { playersApi } from "../api/playersApi";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await playersApi.getTeams(true);
        // If data is list of strings or list of objects
        if (Array.isArray(data)) {
          const formatted = data.map((item) => {
            if (typeof item === 'string') {
              return {
                id: item,
                name: item,
                crest_url: `https://resources.premierleague.com/premierleague/badges/70/t3.png`,
                stadium: `${item.replace(/-/g, ' ')} Stadium`,
              };
            }
            return item;
          });
          setTeams(formatted);
          setFilteredTeams(formatted);
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredTeams(teams);
    } else {
      setFilteredTeams(
        teams.filter((t) =>
          t.name.replace(/-/g, " ").toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, teams]);

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto relative">
      {/* Background blobs */}
      <div className="blob w-[300px] h-[300px] bg-purple-200/20 top-[-5%] left-[-5%]"></div>
      <div className="blob w-[300px] h-[300px] bg-pink-100/20 bottom-[-5%] right-[-5%]"></div>

      {/* Header Panel */}
      <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 pb-8 md:pb-12 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100">
            <Trophy size={14} className="text-purple-700" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-950">
              The 20 Member Clubs
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
            Premier League Clubs
          </h1>
          <p className="text-sm md:text-base font-semibold text-slate-500 max-w-xl">
            Explore official club rosters, home grounds, and squad analytics.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search club name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-12 h-12 border-3 border-purple-200 border-t-purple-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Loading Official Clubs...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {filteredTeams.map((team) => (
            <Link
              key={team.id || team.name}
              to={`/players?team=${encodeURIComponent(team.name)}`}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Official Badge from API */}
                <div className="w-20 h-20 mx-auto mb-5 p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TeamCrest
                    crestUrl={team.crest_url}
                    teamName={team.name}
                    className="max-w-full max-h-full object-contain drop-shadow"
                  />
                </div>


                <div className="text-center space-y-1">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-purple-950 transition-colors">
                    {team.name.replace(/-/g, " ")}
                  </h3>
                  {team.stadium && (
                    <p className="text-xs font-semibold text-slate-400 flex items-center justify-center gap-1">
                      <MapPin size={12} />
                      {team.stadium}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  View Squad
                </span>
                <div className="w-8 h-8 rounded-full bg-purple-50 group-hover:bg-purple-950 text-purple-950 group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
