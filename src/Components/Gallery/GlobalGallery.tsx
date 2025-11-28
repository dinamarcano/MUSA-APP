// src/Components/Gallery/GlobalGallery.tsx
import React, { useEffect, useState } from "react";
import { getAllArtworks, type UiArtwork } from "../../utils/supabaseArtworks";
import ArtworkModal from "../ArtworkModal";

const GlobalGallery: React.FC = () => {
  const [items, setItems] = useState<UiArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<UiArtwork | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllArtworks();
        setItems(data);
      } catch (e) {
        console.error("Error cargando artworks globales", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Cargando galería global...</div>;
  if (!items.length)
    return <div className="text-gray-600">Aún no hay artworks publicados.</div>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((a) => {
          const altText =
            a.title && a.title.trim().length > 0
              ? a.title
              : `art-${String(a.id)}`;
          return (
            <article key={a.id} className="bg-white rounded-2xl shadow p-4">
              <img
                src={a.image}
                alt={altText}
                className="w-full h-72 object-cover rounded-2xl cursor-pointer"
                onClick={() => {
                  setCurrent(a);
                  setOpen(true);
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Imagen+no+disponible";
                }}
              />
              <div className="mt-3">
                <h3 className="text-lg font-semibold">
                  {a.title || "Sin título"}
                </h3>
                {a.description && (
                  <p className="text-sm text-gray-600">{a.description}</p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {current && (
        <ArtworkModal
          open={open}
          onClose={() => setOpen(false)}
          artwork={{
            id: current.id,
            image: current.image,
            title: current.title,
            description: current.description,
          }}
        />
      )}
    </>
  );
};

export default GlobalGallery;

