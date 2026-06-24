-- SNDB: Advisory Board & General Members
-- Run this in Supabase → SQL Editor
--
-- Reuses existing tables:
--   committee_categories  (committee_group = 'advisory' | 'general')
--   committee_members     (same fields as executive committee)
--
-- Manage members in Dashboard → Executive Committee
-- Set Group to "Advisory Board" or "General Members" when adding sections/members.

-- ---------------------------------------------------------------------------
-- 1. Allow new committee_group values (safe if constraint already exists)
-- ---------------------------------------------------------------------------
ALTER TABLE committee_categories
  DROP CONSTRAINT IF EXISTS committee_categories_committee_group_check;

ALTER TABLE committee_categories
  ADD CONSTRAINT committee_categories_committee_group_check
  CHECK (committee_group IN ('current', 'past', 'advisory', 'general'));

-- ---------------------------------------------------------------------------
-- 2. Sample categories (skipped if slug already exists)
-- ---------------------------------------------------------------------------
INSERT INTO committee_categories (
  label,
  heading,
  slug,
  description,
  sort_order,
  layout,
  committee_group
)
SELECT
  'Advisory Board',
  'Advisory Board Members',
  'advisory-board',
  'Experienced advisors guiding SNDB.',
  1,
  'profile',
  'advisory'
WHERE NOT EXISTS (
  SELECT 1 FROM committee_categories WHERE slug = 'advisory-board'
);

INSERT INTO committee_categories (
  label,
  heading,
  slug,
  description,
  sort_order,
  layout,
  committee_group
)
SELECT
  'General Members',
  'General Members',
  'general-members',
  'SNDB general membership directory.',
  1,
  'profile',
  'general'
WHERE NOT EXISTS (
  SELECT 1 FROM committee_categories WHERE slug = 'general-members'
);

-- ---------------------------------------------------------------------------
-- 3. Sample members (only if category has no members yet)
--    Replace names/details in Dashboard after running, or edit below.
-- ---------------------------------------------------------------------------
INSERT INTO committee_members (
  category_id,
  role_title,
  name,
  phone,
  email,
  working_place,
  degree,
  specialist,
  address,
  sort_order
)
SELECT
  c.id,
  'Advisor',
  'Dr. Sample Advisor',
  9810000001,
  'advisor@example.com',
  'Everest Hospital, Kathmandu',
  'MD',
  'General Medicine',
  'Kathmandu, Nepal',
  1
FROM committee_categories c
WHERE c.slug = 'advisory-board'
  AND NOT EXISTS (
    SELECT 1 FROM committee_members m WHERE m.category_id = c.id
  );

INSERT INTO committee_members (
  category_id,
  role_title,
  name,
  phone,
  email,
  working_place,
  degree,
  specialist,
  address,
  sort_order
)
SELECT
  c.id,
  'Member',
  'Dr. Sample General Member',
  9810000002,
  'member@example.com',
  'Teaching Hospital, Kathmandu',
  'MBBS',
  'Internal Medicine',
  'Lalitpur, Nepal',
  1
FROM committee_categories c
WHERE c.slug = 'general-members'
  AND NOT EXISTS (
    SELECT 1 FROM committee_members m WHERE m.category_id = c.id
  );

-- ---------------------------------------------------------------------------
-- Done. Public pages:
--   /members/advisory-board
--   /members/general-members
-- Apply form: /register-member
-- ---------------------------------------------------------------------------
