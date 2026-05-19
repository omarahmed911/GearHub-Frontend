import { useEffect, useState } from "react";
import { getProducts } from "./ProductsApi";
import "./Products.css";

export default function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts("")
            .then((data) => {
                console.log("API Response:", data);
                setProducts(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setProducts([]);
            });
    }, []);

    const hasProducts = Array.isArray(products) && products.length > 0;

    return (
        <div className="products-page">
            <div className="products-page__inner">
                <header className="products-page__header">
                    <h1 className="products-page__title">All Products</h1>
                    <p className="products-page__subtitle">
                        {hasProducts
                            ? `${products.length} item${products.length === 1 ? "" : "s"} available`
                            : "Browse our catalog of parts and accessories"}
                    </p>
                </header>

                <div className={`products-grid${!hasProducts ? " products-grid--empty" : ""}`}>
                    {hasProducts ? (
                        products.map((product, index) => (
                            <article key={product.id || index} className="products-card">
                                <div className="products-card__image-wrap">
                                    <img
                                        src={
                                            product.image ||
                                            product.imageUrl ||
                                            "https://via.placeholder.com/600"
                                        }
                                        alt={product.name || "Product"}
                                    />

                                    <button
                                        type="button"
                                        aria-label="Add to favorites"
                                        className="products-card__favorite"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            width={18}
                                            height={18}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <div className="products-card__body">
                                    <div className="products-card__top">
                                        <h3 className="products-card__name">
                                            {product.name || "Product Name"}
                                        </h3>

                                        {product.category && (
                                            <span className="products-card__category">
                                                {product.category}
                                            </span>
                                        )}
                                    </div>

                                    <p className="products-card__brand">
                                        {product.brand || "Brand"}
                                        {product.model ? `, ${product.model}` : ""}
                                    </p>

                                    <div className="products-card__meta">
                                        <span>
                                            Part No: {product.partNumber || product.id || "N/A"}
                                        </span>
                                        <span className="products-card__stock">
                                            {product.stockQuantity ?? 10} in stock
                                        </span>
                                    </div>

                                    <div className="products-card__footer">
                                        <button type="button" className="products-card__cart-btn">
                                            Add Cart
                                        </button>

                                        <p className="products-card__price">
                                            E£
                                            {product.price
                                                ? Number(product.price).toFixed(2)
                                                : "0.00"}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="products-empty">
                            <p className="products-empty__title">No products found</p>
                            <p className="products-empty__text">
                                Check back later or adjust your search filters.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

