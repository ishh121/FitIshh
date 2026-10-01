import React, { useState } from 'react';
import { FamilyWellness } from '../features/FamilyWellness';
import type { FamilyMember } from '../../types/family';
import { Users, Plus, X } from 'lucide-react';

interface FamilyHubViewProps {
  members: FamilyMember[];
  onMembersChange: (members: FamilyMember[]) => Promise<void>;
  onOpenAICoach: () => void;
}

export const FamilyHubView: React.FC<FamilyHubViewProps> = ({ members, onMembersChange }) => {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState<FamilyMember['relation']>('Self');
  const [age, setAge] = useState('');
  const [saveError, setSaveError] = useState('');

  const handleAddMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const colors: Record<FamilyMember['relation'], FamilyMember['colorScheme']> = {
      Self: 'emerald', Father: 'amber', Mother: 'rose', Grandmother: 'cyan', Spouse: 'rose', Child: 'cyan',
    };
    const member: FamilyMember = {
      id: crypto.randomUUID(),
      name: name.trim(),
      relation,
      age: Number(age),
      avatar: '',
      colorScheme: colors[relation],
      healthConditions: [],
      vitals: {
        todaySteps: 0,
        stepsGoal: 10000,
        waterIntakeLiters: 0,
        medicationsTaken: 0,
        totalMedications: 0,
        lastChecked: 'No measurements yet',
      },
      streakDays: 0,
    };

    try {
      await onMembersChange([...members, member]);
      setName('');
      setAge('');
      setRelation('Self');
      setSaveError('');
      setIsAddingMember(false);
    } catch {
      setSaveError('Could not save this profile. Check your connection and try again.');
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-surya-700 dark:text-surya-400 uppercase tracking-wider">
              Parivaar Health Hub
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">{members.length} Family Profiles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white">
            Family Wellness & Elder Care
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Care for elders with chronic conditions, share step streaks, and ensure instant SOS protection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setIsAddingMember((open) => !open)} className="px-4 py-2.5 rounded-full text-xs font-semibold bg-white hover:bg-slate-100 dark:bg-obsidian-850 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prana-500">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Family Member</span>
          </button>
        </div>
      </div>

      {isAddingMember && (
        <form onSubmit={handleAddMember} className="grid gap-4 rounded-2xl border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-obsidian-900/70 sm:grid-cols-[1fr_1fr_120px_auto] sm:items-end">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-obsidian-950" />
          </label>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Relation
            <select value={relation} onChange={(event) => setRelation(event.target.value as FamilyMember['relation'])} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-obsidian-950">
              {['Self', 'Father', 'Mother', 'Grandmother', 'Spouse', 'Child'].map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Age
            <input type="number" min="1" max="120" value={age} onChange={(event) => setAge(event.target.value)} required className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-obsidian-950" />
          </label>
          <div className="flex items-center gap-2">
            <button type="submit" className="rounded-lg bg-prana-500 px-4 py-2 text-sm font-bold text-obsidian-950">Save</button>
            <button type="button" aria-label="Cancel adding family member" onClick={() => setIsAddingMember(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"><X className="h-4 w-4" /></button>
          </div>
          {saveError && <p role="alert" className="text-xs text-rose-600 sm:col-span-full">{saveError}</p>}
        </form>
      )}

      {/* Parivaar Wellness Component */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10">
        <FamilyWellness members={members} />
      </div>
    </div>
  );
};
