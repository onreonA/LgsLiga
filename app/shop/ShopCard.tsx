"use client";

interface Reward {
  id: string;
  title: string;
  description: string;
  image_url: string;
  coin_price: number;
  category: string;
}

interface ShopCardProps {
  reward: Reward;
  userCoins: number;
  onPurchase: () => void;
}

export default function ShopCard({
  reward,
  userCoins,
  onPurchase,
}: ShopCardProps) {
  const canAfford = userCoins >= reward.coin_price;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "break":
        return "bg-blue-100 text-blue-700";
      case "food":
        return "bg-orange-100 text-orange-700";
      case "social":
        return "bg-pink-100 text-pink-700";
      case "entertainment":
        return "bg-purple-100 text-purple-700";
      case "shopping":
        return "bg-green-100 text-green-700";
      case "activity":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        <img
          src={reward.image_url}
          alt={reward.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(reward.category)}`}
          >
            {reward.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {reward.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {reward.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <i className="ri-coin-line text-yellow-500 text-xl"></i>
            <span className="text-lg font-bold text-gray-900">
              {reward.coin_price.toLocaleString()}
            </span>
          </div>
          {!canAfford && (
            <span className="text-xs text-red-600 font-medium">
              Yetersiz bakiye
            </span>
          )}
        </div>

        {/* Purchase Button */}
        <button
          onClick={onPurchase}
          disabled={!canAfford}
          className={`w-full py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
            canAfford
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {canAfford ? (
            <>
              <i className="ri-shopping-cart-line w-4 h-4 mr-2"></i>
              Satın Al
            </>
          ) : (
            <>
              <i className="ri-lock-line w-4 h-4 mr-2"></i>
              Yetersiz Coin
            </>
          )}
        </button>
      </div>
    </div>
  );
}
