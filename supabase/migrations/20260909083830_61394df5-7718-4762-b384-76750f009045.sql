CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  sale_price numeric(10,2),
  rating numeric(2,1) NOT NULL DEFAULT 4.5,
  review_count integer NOT NULL DEFAULT 0,
  image_key text NOT NULL,
  popularity integer NOT NULL DEFAULT 0,
  is_new boolean NOT NULL DEFAULT false,
  stock integer NOT NULL DEFAULT 25,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly viewable"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX products_category_idx ON public.products (category);
CREATE INDEX products_popularity_idx ON public.products (popularity DESC);

INSERT INTO public.products (slug, name, category, description, price, sale_price, rating, review_count, image_key, popularity, is_new, stock)
SELECT
  s.category || '-' || s.i AS slug,
  s.pname AS name,
  s.category,
  'A VÉRA studio piece cut from considered fabric with a clean, elongated silhouette. Finished by hand and designed to sit quietly at the centre of a wardrobe.' AS description,
  s.price,
  CASE WHEN s.rn % 8 = 1 THEN round(s.price * 0.7, 0) END AS sale_price,
  (38 + (s.i * 7) % 13)::numeric / 10 AS rating,
  12 + (s.i * 17) % 240 AS review_count,
  s.category AS image_key,
  (s.i * 37) % 1000 AS popularity,
  (s.rn % 8 = 2) AS is_new,
  4 + (s.i * 5) % 40 AS stock
FROM (
  SELECT
    c.category,
    i,
    row_number() OVER (ORDER BY c.category, i) AS rn,
    (c.adjectives)[1 + ((i * 3) % array_length(c.adjectives, 1))] || ' ' ||
      (c.nouns)[1 + ((i * 5) % array_length(c.nouns, 1))] AS pname,
    (999 + ((i * 137) % 71) * 100)::numeric AS price
  FROM (
    VALUES
      ('women', ARRAY['Atelier','Structured','Fluid','Monochrome','Sculpted','Essential','Longline'], ARRAY['Wrap Coat','Knit Tunic','Column Skirt','Tailored Vest','Slip Dress','Poplin Shirt','Cashmere Cardigan','Trouser Suit','Belted Jumpsuit','Merino Sweater']),
      ('men', ARRAY['Atelier','Structured','Relaxed','Monochrome','Sharp','Essential','Longline'], ARRAY['Overshirt','Wool Blazer','Crew Knit','Pleated Trouser','Oxford Shirt','Bomber','Field Coat','Polo Knit','Chino','Tailored Suit']),
      ('dresses', ARRAY['Draped','Bias-Cut','Sculpted','Midnight','Column','Ivory','Pleated'], ARRAY['Midi Dress','Slip Dress','Shirt Dress','Evening Gown','Knit Dress','Wrap Dress','Tiered Dress','Satin Dress','Blazer Dress','Maxi Dress']),
      ('tops', ARRAY['Silk','Sheer','Ribbed','Boxy','Cropped','Fine-Gauge','Poplin'], ARRAY['Blouse','Shell Top','Knit Tee','Bodysuit','Tank','Cardigan','Turtleneck','Camisole','Shirt','Sweater']),
      ('bottoms', ARRAY['High-Rise','Wide-Leg','Tapered','Fluid','Straight','Pleated','Column'], ARRAY['Trouser','Denim','Midi Skirt','Cargo Pant','Tailored Short','Maxi Skirt','Track Pant','Suit Pant','Leather Pant','Pencil Skirt']),
      ('outerwear', ARRAY['Oversized','Double-Breasted','Quilted','Wool','Longline','Cropped','Belted'], ARRAY['Trench','Overcoat','Bomber','Peacoat','Puffer','Blazer Coat','Shearling','Parka','Cape','Leather Jacket']),
      ('shoes', ARRAY['Sculpted','Square-Toe','Minimal','Polished','Soft','Architectural','Low'], ARRAY['Ankle Boot','Leather Loafer','Slingback','Heeled Sandal','Derby','Mule','Knee Boot','Trainer','Ballet Flat','Pump']),
      ('accessories', ARRAY['Grained','Structured','Fine','Brushed','Soft','Matte','Signature'], ARRAY['Tote','Shoulder Bag','Leather Belt','Silk Scarf','Sunglasses','Card Holder','Chain Necklace','Crossbody','Wool Beanie','Leather Gloves'])
  ) AS c(category, adjectives, nouns)
  CROSS JOIN generate_series(1, 70) AS i
) AS s;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();