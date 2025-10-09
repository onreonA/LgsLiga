"use client";

import { useState } from "react";
import ShopCard from "./ShopCard";
import PurchaseModal from "./PurchaseModal";

type Reward = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  coin_price: number;
  category: string;
  is_active: boolean;
};

const mockRewards: Reward[] = [
  {
    id: "1",
    title: "Extra Molalar",
    description: "30 dakika ekstra mola hakkı",
    image_url:
      "https://readdy.ai/api/search-image?query=comfortable%20rest%20break%20chair%20with%20soft%20pillows%20and%20relaxing%20atmosphere%20in%20modern%20study%20room&width=400&height=300&seq=1&orientation=landscape",
    coin_price: 150,
    category: "break",
    is_active: true,
  },
  {
    id: "2",
    title: "Favori Yemek",
    description: "En sevdiğin yemeği annenden isteme hakkı",
    image_url:
      "https://readdy.ai/api/search-image?query=delicious%20homemade%20Turkish%20food%20on%20beautiful%20dinner%20table%20family%20meal%20atmosphere&width=400&height=300&seq=2&orientation=landscape",
    coin_price: 300,
    category: "food",
    is_active: true,
  },
  {
    id: "3",
    title: "Arkadaş Buluşması",
    description: "2 saatlik arkadaş buluşması izni",
    image_url:
      "https://readdy.ai/api/search-image?query=happy%20teenagers%20friends%20meeting%20together%20in%20park%20playing%20games%20laughing%20outdoor%20activity&width=400&height=300&seq=3&orientation=landscape",
    coin_price: 250,
    category: "social",
    is_active: true,
  },
  {
    id: "4",
    title: "Oyun Zamanı",
    description: "1 saat ekstra oyun/telefon zamanı",
    image_url:
      "https://readdy.ai/api/search-image?query=gaming%20setup%20with%20colorful%20LED%20lights%20modern%20gaming%20chair%20and%20multiple%20monitors%20entertainment&width=400&height=300&seq=4&orientation=landscape",
    coin_price: 200,
    category: "entertainment",
    is_active: true,
  },
  {
    id: "5",
    title: "Film Gecesi",
    description: "Aile film gecesi ve atıştırmalık",
    image_url:
      "https://readdy.ai/api/search-image?query=cozy%20movie%20night%20family%20watching%20film%20together%20with%20popcorn%20and%20snacks%20in%20living%20room&width=400&height=300&seq=5&orientation=landscape",
    coin_price: 180,
    category: "entertainment",
    is_active: true,
  },
  {
    id: "6",
    title: "Alışveriş",
    description: "100₺ kıyafet/kitap alışverişi",
    image_url:
      "https://readdy.ai/api/search-image?query=shopping%20mall%20with%20teenage%20clothes%20and%20books%20colorful%20display%20modern%20retail%20environment&width=400&height=300&seq=6&orientation=landscape",
    coin_price: 400,
    category: "shopping",
    is_active: true,
  },
  {
    id: "7",
    title: "Özel Ders Yok",
    description: "1 gün özel ders yapmama hakkı",
    image_url:
      "https://readdy.ai/api/search-image?query=peaceful%20empty%20study%20desk%20with%20books%20closed%20student%20taking%20break%20from%20lessons&width=400&height=300&seq=7&orientation=landscape",
    coin_price: 350,
    category: "break",
    is_active: true,
  },
  {
    id: "8",
    title: "Gezi Günü",
    description: "Ailece yarım günlük gezi",
    image_url:
      "https://readdy.ai/api/search-image?query=family%20day%20trip%20outdoor%20beautiful%20natural%20scenery%20parents%20and%20teenager%20enjoying%20nature%20together&width=400&height=300&seq=8&orientation=landscape",
    coin_price: 500,
    category: "activity",
    is_active: true,
  },
];

const categories = [
  { id: "all", name: "Tümü", icon: "ri-apps-line" },
  { id: "break", name: "Mola", icon: "ri-pause-circle-line" },
  { id: "food", name: "Yemek", icon: "ri-restaurant-line" },
  { id: "social", name: "Sosyal", icon: "ri-group-line" },
  { id: "entertainment", name: "Eğlence", icon: "ri-gamepad-line" },
  { id: "shopping", name: "Alışveriş", icon: "ri-shopping-bag-line" },
  { id: "activity", name: "Aktivite", icon: "ri-map-pin-line" },
];

export default function ShopPage() {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [userCoins] = useState(1250);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredRewards =
    selectedCategory === "all"
      ? mockRewards
      : mockRewards.filter((reward) => reward.category === selectedCategory);

  const handlePurchase = (reward: Reward) => {
    setSelectedReward(reward);
    setShowPurchaseModal(true);
  };

  const formatCoins = (amount: number) => {
    return amount.toLocaleString("tr-TR");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border-b border-gray-200 px-8 py-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ödül Mağazası
            </h1>
            <p className="text-gray-600">
              Kazandığın coinlerle harika ödüller satın al!
            </p>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="ri-coin-line text-2xl w-6 h-6 flex items-center justify-center"></i>
              </div>
              <div>
                <p className="text-sm opacity-90">Bakiyem</p>
                <p
                  className="text-2xl font-bold"
                  suppressHydrationWarning={true}
                >
                  {formatCoins(userCoins)} Coin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <i className={`${category.icon} w-4 h-4 mr-2`}></i>
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRewards.map((reward) => (
          <ShopCard
            key={reward.id}
            reward={reward}
            userCoins={userCoins}
            onPurchase={() => handlePurchase(reward)}
          />
        ))}
      </div>

      {filteredRewards.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-shopping-bag-line text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Bu kategoride ödül yok
          </h3>
          <p className="text-gray-600">Farklı bir kategori seçmeyi deneyin</p>
        </div>
      )}

      {showPurchaseModal && selectedReward && (
        <PurchaseModal
          reward={selectedReward}
          userCoins={userCoins}
          onClose={() => setShowPurchaseModal(false)}
          onConfirm={() => {
            console.log("Satın alma:", selectedReward);
            setShowPurchaseModal(false);
          }}
        />
      )}
    </div>
  );
}
