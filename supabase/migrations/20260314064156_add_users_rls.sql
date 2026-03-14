-- 1. Enable RLS on the 'users' table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy that allows anyone to create a user.
CREATE POLICY "Allow public user creation"
ON public.users
FOR INSERT
WITH CHECK (true);

-- 3. Create a policy that allows users to select their own data.
CREATE POLICY "Allow individual user select access"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- 4. Create a policy that allows users to update their own data.
CREATE POLICY "Allow individual user update access"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
