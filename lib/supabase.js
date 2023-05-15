import { createClient } from '@supabase/supabase-js';

export const supabase = createClient('https://gevgtcbuxmbmbumllquu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdldmd0Y2J1eG1ibWJ1bWxscXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM2NTYyNTgsImV4cCI6MTk5OTIzMjI1OH0.J463BZ57YzpuWTLFgNIfSw3JRGF2csQSwil4TEDabhs');