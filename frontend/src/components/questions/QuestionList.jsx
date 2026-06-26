import { HelpCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import QuestionCard from "./QuestionCard";
import Button from "../ui/Button";

export default function QuestionList({ questions }) {
  // 1. EMPTY STATE: When no questions are found
  if (!questions || !questions.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
        {/* Pulsing icon in the center */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 animate-pulse">
          <HelpCircle className="h-7 w-7" />
        </div>
        
        <h3 className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
          No questions have been posted yet
        </h3>
        
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          Be the first to ask a question and help build the Somali tech community.
        </p>

        {/* "Ask a Question" button inside the empty state */}
        <Link to="/ask" className="mt-6">
          <Button size="sm" className="rounded-xl px-4 py-2 font-medium shadow-sm shadow-indigo-100">
            <Plus className="mr-1 h-4 w-4" />
            Ask the First Question
          </Button>
        </Link>
      </div>
    );
  }

  // 2. LIST STATE: When questions exist
  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      {questions.map((question) => (
        <QuestionCard key={question._id} question={question} />
      ))}
    </div>
  );
}