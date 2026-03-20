import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/marketplace/${product.id}`}
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-neon-purple"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary/20 text-secondary border border-secondary/30">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 truncate">
          {product.name}
        </h3>
        <p className="mt-2 text-2xl font-bold text-accent">
          ₹{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
