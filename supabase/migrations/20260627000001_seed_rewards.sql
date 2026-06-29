-- Seed example rewards for the Slide rewards wallet

insert into rewards (partner_name, offer_description, discount_code, discount_value, minimum_tier, expires_at, is_active)
values
  (
    'ASOS',
    '20% off your entire order, no minimum spend. Valid once per account.',
    'SLIDE20',
    '20% off',
    'rising',
    '2026-12-31',
    true
  ),
  (
    'Gymshark',
    '15% off everything in-store and online. Exclusive to Slide creators.',
    'SLIDEGYM15',
    '15% off',
    'rising',
    '2026-09-30',
    true
  ),
  (
    'Adobe Creative Cloud',
    'Two months free on any annual Creative Cloud plan. New subscribers only.',
    'SLIDEROCKET2M',
    '2 months free',
    'verified',
    null,
    true
  ),
  (
    'Squarespace',
    '30% off your first year on any Squarespace plan. Build your creator portfolio.',
    'SLIDESQ30',
    '30% off',
    'verified',
    '2026-08-31',
    true
  ),
  (
    'Airbnb',
    '£75 credit on your first booking. Perfect for creator trips and shoots.',
    'SLIDEAIRBNB75',
    '£75 credit',
    'elite',
    null,
    true
  );
