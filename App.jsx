import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, TrendingDown, Clock, Plus, Check } from 'lucide-react';

const App = () => {
  const [area, setArea] = useState('渋谷区');
  const [prices, setPrices] = useState([]);
  const [showAddPrice, setShowAddPrice] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('全て');

  // カテゴリ
  const categories = ['全て', '野菜', '果物', '肉類', '魚類', '乳製品', '調味料', '米・穀物', '日用品'];

  // エリアリスト
  const areas = ['渋谷区', '新宿区', '世田谷区', '目黒区', '港区', '中野区', '杉並区'];

  // ストレージから価格データを読み込む
  useEffect(() => {
    const loadPrices = async () => {
      try {
        const result = await window.storage.get('prices-data');
        if (result && result.value) {
          setPrices(JSON.parse(result.value));
        } else {
          // 初期サンプルデータ
          const samplePrices = [
            { id: '1', product: 'キャベツ', category: '野菜', supermarket: 'スーパーA', price: 158, area: '渋谷区', updatedAt: new Date().toISOString(), unit: '1個' },
            { id: '2', product: 'キャベツ', category: '野菜', supermarket: 'スーパーB', price: 198, area: '渋谷区', updatedAt: new Date().toISOString(), unit: '1個' },
            { id: '3', product: '玉ねぎ', category: '野菜', supermarket: 'スーパーA', price: 298, area: '渋谷区', updatedAt: new Date().toISOString(), unit: '3個入' },
            { id: '4', product: '玉ねぎ', category: '野菜', supermarket: 'スーパーC', price: 248, area: '渋谷区', updatedAt: new Date().toISOString(), unit: '3個入' },
            { id: '5', product: '卵', category: '乳製品', supermarket: 'スーパーB', price: 228, area: '渋谷区', updatedAt: new Date().toISOString(), unit: '10個' },
            { id: '6', product: '卵', category: '乳製品', supermarket: 'スーパーA', price: 258, area: '渋谷区', updatedAt: new Date().toISOString(), unit: '10個' },
            { id: '7', product: '牛乳', category: '乳製品', supermarket: 'スーパーC', price: 198, area: '渋谷区', updatedAt: new Date().toISOString(), unit: '1L' },
            { id: '8', product: '牛乳', category: '乳製品', supermarket: 'スーパーA', price: 218, area: '渋谷区', updatedAt: new Date().toISOString(), unit: '1L' },
            { id: '9', product: '豚こま切れ肉', category: '肉類', supermarket: 'スーパーB', price: 398, area: '渋谷区', updatedAt: new Date().toISOString(), unit: '100g' },
            { id: '10', product: '豚こま切れ肉', category: '肉類', supermarket: 'スーパーC', price: 358, area: '渋谷区', updatedAt: new Date().toISOString(), unit: '100g' },
            { id: '11', product: 'りんご', category: '果物', supermarket: 'スーパーA', price: 498, area: '渋谷区', updatedAt: new Date().toISOString(), unit: '4個入' },
            { id: '12', product: 'バナナ', category: '果物', supermarket: 'スーパーB', price: 158, area: '渋谷区', updatedAt: new Date().toISOString(), unit: '1房' },
            { id: '13', product: '醤油', category: '調味料', supermarket: 'スーパーC', price: 298, area: '渋谷区', updatedAt: new Date().toISOString(), unit: '1L' },
            { id: '14', product: 'お米', category: '米・穀物', supermarket: 'スーパーA', price: 1980, area: '渋谷区', updatedAt: new Date().toISOString(), unit: '5kg' },
          ];
          setPrices(samplePrices);
          await window.storage.set('prices-data', JSON.stringify(samplePrices));
        }
      } catch (error) {
        console.log('Loading initial data');
        // エラー時は空配列
        setPrices([]);
      }
    };
    loadPrices();
  }, []);

  // 価格データを保存
  const savePrices = async (newPrices) => {
    try {
      await window.storage.set('prices-data', JSON.stringify(newPrices));
      setPrices(newPrices);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  // 商品ごとにグループ化して最安値を表示
  const getProductComparison = () => {
    const filtered = prices.filter(p => 
      p.area === area && 
      (selectedCategory === '全て' || p.category === selectedCategory)
    );

    const productMap = {};
    filtered.forEach(price => {
      if (!productMap[price.product]) {
        productMap[price.product] = [];
      }
      productMap[price.product].push(price);
    });

    return Object.entries(productMap).map(([product, priceList]) => {
      const sorted = priceList.sort((a, b) => a.price - b.price);
      return {
        product,
        category: sorted[0].category,
        cheapest: sorted[0],
        others: sorted.slice(1),
      };
    }).sort((a, b) => a.product.localeCompare(b.product, 'ja'));
  };

  // 新しい価格を追加
  const addNewPrice = async (formData) => {
    const newPrice = {
      id: Date.now().toString(),
      product: formData.product,
      category: formData.category,
      supermarket: formData.supermarket,
      price: parseInt(formData.price),
      area: formData.area,
      unit: formData.unit,
      updatedAt: new Date().toISOString(),
    };
    const updatedPrices = [...prices, newPrice];
    await savePrices(updatedPrices);
    setShowAddPrice(false);
  };

  // 時間表示
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMinutes = Math.floor((now - past) / 60000);
    
    if (diffMinutes < 60) return `${diffMinutes}分前`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}時間前`;
    return `${Math.floor(diffMinutes / 1440)}日前`;
  };

  const productList = getProductComparison();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-orange-500" size={28} />
              <h1 className="text-xl font-bold text-gray-800">スーパー最安値ナビ</h1>
            </div>
            <button
              onClick={() => setShowAddPrice(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors"
            >
              <Plus size={18} />
              価格を投稿
            </button>
          </div>
          
          {/* エリア選択 */}
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={18} className="text-gray-500" />
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {areas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* カテゴリ選択 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {productList.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
            <p>このエリア・カテゴリの価格情報がまだありません</p>
            <p className="text-sm mt-2">価格を投稿して情報を共有しましょう！</p>
          </div>
        ) : (
          <div className="space-y-3">
            {productList.map(({ product, category, cheapest, others }) => (
              <div key={product} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{product}</h3>
                      <span className="text-xs text-gray-500">{category}</span>
                    </div>
                  </div>

                  {/* 最安値 */}
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg mb-3 border-2 border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="text-orange-600" size={20} />
                      <span className="text-orange-600 font-bold text-sm">最安値</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-3xl font-bold text-orange-600">
                          ¥{cheapest.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {cheapest.unit} / {cheapest.supermarket}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} />
                          {getTimeAgo(cheapest.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* その他の店舗 */}
                  {others.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 font-semibold">その他の店舗</div>
                      {others.map((other) => {
                        const diff = other.price - cheapest.price;
                        return (
                          <div key={other.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-semibold text-gray-700">{other.supermarket}</div>
                              <div className="text-xs text-gray-500">{other.unit}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-700">¥{other.price.toLocaleString()}</div>
                              <div className="text-xs text-red-500">+¥{diff}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 価格投稿モーダル */}
      {showAddPrice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">価格情報を投稿</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                addNewPrice(Object.fromEntries(formData));
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">商品名</label>
                    <input
                      name="product"
                      type="text"
                      required
                      placeholder="例: キャベツ"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">カテゴリ</label>
                    <select
                      name="category"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {categories.filter(c => c !== '全て').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">スーパー名</label>
                    <input
                      name="supermarket"
                      type="text"
                      required
                      placeholder="例: スーパーA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">価格（円）</label>
                    <input
                      name="price"
                      type="number"
                      required
                      placeholder="例: 158"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">単位</label>
                    <input
                      name="unit"
                      type="text"
                      required
                      placeholder="例: 1個、100g、1L"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">エリア</label>
                    <select
                      name="area"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {areas.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddPrice(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    投稿する
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* フッター情報 */}
      <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <p>💡 みんなで価格情報を共有して、お得にお買い物！</p>
        <p className="mt-1">投稿された情報は全ユーザーと共有されます</p>
      </div>
    </div>
  );
};

export default App;
