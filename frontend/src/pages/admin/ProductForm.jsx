import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCategories } from "../../services/category.service";
import {
  createProduct,
  updateProduct,
  getProductById,
  updateVariantStock,
} from "../../services/adminProduct.service";
import { slugify } from "../../utils/slugify";
import AdminNav from "../../components/admin/AdminNav";

const EMPTY_VARIANT = { size: "", color: "", stock: 0 };

function ProductForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [variants, setVariants] = useState([{ ...EMPTY_VARIANT }]);
  const [existingVariants, setExistingVariants] = useState([]);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    getProductById(token, id)
      .then((product) => {
        setName(product.name);
        setSlug(product.slug);
        setDescription(product.description);
        setBasePrice(product.basePrice);
        setSalePrice(product.salePrice ?? "");
        setCategoryId(product.categoryId);
        setIsActive(product.isActive);
        setImageUrl(product.images[0]?.url ?? "");
        setExistingVariants(
          product.variants.map((variant) => ({ ...variant, originalStock: variant.stock })),
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditMode, token]);

  function handleNameChange(value) {
    setName(value);
    if (!isEditMode) setSlug(slugify(value));
  }

  function updateVariantField(index, field, value) {
    setVariants((prev) =>
      prev.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant)),
    );
  }

  function addVariantRow() {
    setVariants((prev) => [...prev, { ...EMPTY_VARIANT }]);
  }

  function removeVariantRow(index) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  function updateExistingVariantStock(index, stock) {
    setExistingVariants((prev) =>
      prev.map((variant, i) => (i === index ? { ...variant, stock } : variant)),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name,
      slug,
      description,
      basePrice: Number(basePrice),
      salePrice: salePrice === "" ? null : Number(salePrice),
      categoryId,
      isActive,
    };

    try {
      if (isEditMode) {
        await updateProduct(token, id, payload);

        const changedVariants = existingVariants.filter(
          (variant) => Number(variant.stock) !== variant.originalStock,
        );
        for (const variant of changedVariants) {
          await updateVariantStock(token, variant.id, Number(variant.stock));
        }
      } else {
        await createProduct(token, {
          ...payload,
          images: imageUrl ? [{ url: imageUrl, position: 0 }] : [],
          variants: variants
            .filter((variant) => variant.size && variant.color)
            .map((variant) => ({
              size: variant.size,
              color: variant.color,
              stock: Number(variant.stock),
              sku: `${slug}-${variant.size}-${variant.color}`.toUpperCase(),
            })),
        });
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="mx-auto max-w-2xl px-4 py-10 text-gray-500">Cargando...</p>;
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <AdminNav />
      <h1 className="text-2xl font-semibold">
        {isEditMode ? "Editar producto" : "Nuevo producto"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium" htmlFor="name">
            Nombre
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={isEditMode}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="description">
            Descripción
          </label>
          <textarea
            id="description"
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium" htmlFor="basePrice">
              Precio
            </label>
            <input
              id="basePrice"
              type="number"
              required
              min="0"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="salePrice">
              Precio de oferta (opcional)
            </label>
            <input
              id="salePrice"
              type="number"
              min="0"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="category">
            Categoría
          </label>
          <select
            id="category"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Seleccionar...
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {!isEditMode && (
          <div>
            <label className="text-sm font-medium" htmlFor="imageUrl">
              URL de imagen
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        )}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Producto activo (visible en el catálogo)
        </label>

        {!isEditMode && (
          <div>
            <p className="text-sm font-medium">Variantes (talla / color / stock)</p>
            <div className="mt-2 space-y-2">
              {variants.map((variant, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    placeholder="Talla"
                    value={variant.size}
                    onChange={(e) => updateVariantField(index, "size", e.target.value)}
                    className="w-1/4 rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                  <input
                    placeholder="Color"
                    value={variant.color}
                    onChange={(e) => updateVariantField(index, "color", e.target.value)}
                    className="w-1/3 rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Stock"
                    value={variant.stock}
                    onChange={(e) => updateVariantField(index, "stock", e.target.value)}
                    className="w-1/4 rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariantRow(index)}
                      className="text-sm text-red-600 underline"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addVariantRow} className="mt-2 text-sm underline">
              + Agregar variante
            </button>
          </div>
        )}

        {isEditMode && existingVariants.length > 0 && (
          <div>
            <p className="text-sm font-medium">Stock por variante</p>
            <div className="mt-2 space-y-2">
              {existingVariants.map((variant, index) => (
                <div key={variant.id} className="flex items-center justify-between text-sm">
                  <span>
                    {variant.size} / {variant.color}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateExistingVariantStock(index, e.target.value)}
                    className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 rounded-full bg-black py-3 text-sm text-white disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </section>
  );
}

export default ProductForm;
