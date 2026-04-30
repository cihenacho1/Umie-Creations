-- Replace winter / Christmas-tree stock imagery with on-brand editorial florals.
UPDATE "GalleryItem"
SET
  "title" = 'Studio bouquet study',
  "category" = 'flowers',
  "imageUrl" = 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=2000&auto=format&fit=max&q=90',
  "description" = 'Editorial bouquet photography in the Umie palette.'
WHERE "imageUrl" LIKE '%photo-1543589077%';
