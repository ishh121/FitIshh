import React, { useEffect, useState } from 'react';
import type { FamilyMember } from '../../types/family';
import { Users, Heart, Activity, Pill, AlertTriangle, ShieldAlert, CheckCircle, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';

export const FamilyWellness: React.FC<{ members?: FamilyMember[] }> = ({ members = [] }) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [sosStatus, setSosStatus] = useState<string | null>(null);

  useEffect(() => {
    if (members.length && !members.some((member) => member.id === selectedMemberId)) {
      setSelectedMemberId(members[0].id);
    }
  }, [members, selectedMemberId]);

  const selectedMember = members.find((member) => member.id === selectedMemberId);

  const handleTriggerSOS = () => {
    setSosStatus('Emergency contact integration is not configured yet.');
    setTimeout(() => {
      setSosStatus(null);
    }, 6000);
  };

  if (!members.length || !selectedMember) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-white/15">
        <Users className="mx-auto h-8 w-8 text-slate-400" />
        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">No family profiles yet</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Add a family member to begin recording their health data.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-prana-600 dark:text-prana-400" />
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Parivaar Wellness Dashboard</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surya-500/20 text-surya-700 dark:text-surya-400 border border-surya-500/30">
              Multi-Generation Care
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor elderly parents' blood sugar & BP, manage family medication schedules, and enable instant SOS alerts.
          </p>
        </div>

        {/* SOS Emergency Button */}
        <button
          onClick={handleTriggerSOS}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Test Emergency SOS Alert</span>
        </button>
      </div>

      {/* SOS Alert Banner if triggered */}
      {sosStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-3 shadow-xl"
        >
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
          <span className="font-semibold">{sosStatus}</span>
        </motion.div>
      )}

      {/* Member Cards Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {members.map((member) => {
          const isSelected = member.id === selectedMemberId;
          return (
            <div
              key={member.id}
              onClick={() => setSelectedMemberId(member.id)}
              className={`p-4 rounded-2xl glass-panel border transition-all cursor-pointer flex items-center gap-3 ${
                isSelected
                  ? 'border-prana-500/60 shadow-glow-prana scale-[1.02]'
                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {member.avatar ? (
                <img src={member.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-prana-400/40" />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-prana-400/40 bg-prana-500/10 text-prana-600 dark:text-prana-400"><UserRound className="h-5 w-5" /></span>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-sm truncate">{member.name}</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {member.relation} • {member.age}y
                </span>
                <span className="text-[10px] text-surya-600 dark:text-surya-400 font-semibold">{member.streakDays}d streak 🔥</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Deep Dive Vitals & Routine Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Vitals overview */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-semibold text-prana-600 dark:text-prana-400 uppercase tracking-wider">
                Vitals Telemetry
              </span>
              <h4 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                {selectedMember.name} ({selectedMember.relation})
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Last Synced: {selectedMember.vitals.lastChecked}</span>
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Blood Pressure */}
            {selectedMember.vitals.bloodPressure && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-950/70 border border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                    Blood Pressure
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10">
                    {selectedMember.vitals.bpStatus}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{selectedMember.vitals.bloodPressure}</div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Senior systolic range normal</span>
              </div>
            )}

            {/* Blood Glucose */}
            {selectedMember.vitals.bloodSugar && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-950/70 border border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    Fasting Glucose
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-500/10">
                    {selectedMember.vitals.sugarStatus}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {selectedMember.vitals.bloodSugar} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">mg/dL</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Morning test before breakfast</span>
              </div>
            )}

            {/* Steps & Activity */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-950/70 border border-slate-200 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Daily Steps</span>
                <span className="text-[10px] text-prana-600 dark:text-prana-400 font-bold px-1.5 py-0.5 rounded bg-prana-500/10">
                  {Math.round((selectedMember.vitals.todaySteps / selectedMember.vitals.stepsGoal) * 100)}%
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {selectedMember.vitals.todaySteps.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Goal: {selectedMember.vitals.stepsGoal.toLocaleString()} steps</span>
            </div>
          </div>

          {/* Routine alert status */}
          {selectedMember.routineAlert && (
            <div className="p-4 rounded-2xl bg-prana-500/10 border border-prana-500/25 flex items-start gap-3 text-xs">
              <CheckCircle className="w-4 h-4 text-prana-600 dark:text-prana-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-prana-700 dark:text-prana-300 block mb-0.5">Today's Care Routine Update</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedMember.routineAlert}</p>
              </div>
            </div>
          )}
        </div>

        {/* Medicine & Care Schedule */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Pill className="w-4 h-4 text-surya-600 dark:text-surya-400" />
              <span>Medication Schedule</span>
            </h4>
            <span className="text-xs font-bold text-prana-600 dark:text-prana-400">
              {selectedMember.vitals.medicationsTaken}/{selectedMember.vitals.totalMedications} Taken
            </span>
          </div>

          <p className="rounded-xl border border-dashed border-slate-300 p-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
            No medication schedule is recorded for this profile.
          </p>

          {/* Quick Doctor Summary button */}
          <div className="pt-2">
            <button className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2">
              <span>Export 30-Day Vitals PDF for Doctor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
