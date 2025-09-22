-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create personalization table for quiz results
CREATE TABLE IF NOT EXISTS public.personalization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  age INTEGER,
  goals TEXT[],
  skill_level TEXT,
  subjects TEXT[],
  learning_style TEXT,
  time_commitment INTEGER, -- minutes per day
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  provider TEXT, -- 'coursera', 'edx', 'youtube', etc.
  external_url TEXT,
  thumbnail_url TEXT,
  category TEXT,
  difficulty_level TEXT,
  duration_hours INTEGER,
  rating DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_courses table for bookmarks and progress
CREATE TABLE IF NOT EXISTS public.user_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  is_bookmarked BOOLEAN DEFAULT FALSE,
  progress_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'general' or 'course'
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  questions JSONB NOT NULL,
  answers JSONB,
  score INTEGER,
  total_questions INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create streaks table
CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL, -- 'streak', 'course_completion', 'quiz_score', etc.
  achievement_name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for personalization
CREATE POLICY "personalization_select_own" ON public.personalization FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "personalization_insert_own" ON public.personalization FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "personalization_update_own" ON public.personalization FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "personalization_delete_own" ON public.personalization FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_courses
CREATE POLICY "user_courses_select_own" ON public.user_courses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_courses_insert_own" ON public.user_courses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_courses_update_own" ON public.user_courses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_courses_delete_own" ON public.user_courses FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for quizzes
CREATE POLICY "quizzes_select_own" ON public.quizzes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "quizzes_insert_own" ON public.quizzes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "quizzes_update_own" ON public.quizzes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "quizzes_delete_own" ON public.quizzes FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for streaks
CREATE POLICY "streaks_select_own" ON public.streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "streaks_insert_own" ON public.streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "streaks_update_own" ON public.streaks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "streaks_delete_own" ON public.streaks FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for achievements
CREATE POLICY "achievements_select_own" ON public.achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "achievements_insert_own" ON public.achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "achievements_update_own" ON public.achievements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "achievements_delete_own" ON public.achievements FOR DELETE USING (auth.uid() = user_id);

-- Courses table is public read for all authenticated users
CREATE POLICY "courses_select_all" ON public.courses FOR SELECT TO authenticated USING (true);
