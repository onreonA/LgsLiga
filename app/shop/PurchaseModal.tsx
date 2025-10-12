"use client";

import Image from "next/image";

interface Reward {
  id: string;
  title: string;
  description: string;
  image_url: string;
  coin_price: number;
  category: string;
}

interface PurchaseModalProps {
  reward: Reward;
  userCoins: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PurchaseModal({
  reward,
  userCoins,
  onClose,
  onConfirm,
}: PurchaseModalProps) {
  const remainingCoins = userCoins - reward.coin_price;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Ödül Satın Al</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-gray-600"></i>
            </button>
          </div>

          {/* Reward Details */}
          <div className="mb-6">
            <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
              <Image
                src={reward.image_url}
                alt={reward.title}
                fill
                className="object-cover object-top"
              />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {reward.title}
            </h4>
            <p className="text-gray-600 mb-4">{reward.description}</p>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Mevcut Bakiye:</span>
              <div className="flex items-center space-x-1">
                <i className="ri-coin-line text-yellow-500"></i>
                <span className="font-semibold">
                  {userCoins.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Ödül Bedeli:</span>
              <div className="flex items-center space-x-1 text-red-600">
                <i className="ri-subtract-line"></i>
                <span className="font-semibold">
                  {reward.coin_price.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">
                  Kalan Bakiye:
                </span>
                <div className="flex items-center space-x-1">
                  <i className="ri-coin-line text-yellow-500"></i>
                  <span className="font-bold text-lg">
                    {remainingCoins.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <i className="ri-information-line text-blue-600 text-lg mt-0.5"></i>
              <div className="text-sm">
                <p className="text-blue-900 font-medium mb-1">Önemli Bilgi</p>
                <p className="text-blue-700">
                  Satın alma talebiniz admin onayına gönderilecek. Onaylandıktan
                  sonra ödülünüzü kullanabilirsiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              İptal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer whitespace-nowrap"
            >
              <i className="ri-shopping-cart-line w-4 h-4 mr-2"></i>
              Satın Al
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
