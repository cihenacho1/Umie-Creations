-- Drop gallery rows pointing at the removed off-brand hero image (yellow hoodie / basketball court).
DELETE FROM "GalleryItem" WHERE "imageUrl" LIKE '%photo-1515886657613%';
