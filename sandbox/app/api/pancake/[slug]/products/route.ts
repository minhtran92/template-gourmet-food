import { NextResponse } from 'next/server';

// Mock product data for sandbox dev
const MOCK_PRODUCTS = [
  { id: '1', name: 'Cà phê sữa đá', price: 25000, images: ['https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400'] },
  { id: '2', name: 'Bánh mì thịt nướng', price: 35000, images: ['https://images.unsplash.com/photo-1601524909342-973e8bb0e848?w=400'] },
  { id: '3', name: 'Phở bò', price: 45000, images: ['https://images.unsplash.com/photo-1503764659696-97e8b1c3f3c1?w=400'] },
  { id: '4', name: 'Trà đào cam sả', price: 30000, images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'] },
  { id: '5', name: 'Bún chả Hà Nội', price: 50000, images: ['https://images.unsplash.com/photo-1559847844-53156b9c6c0c?w=400'] },
  { id: '6', name: 'Chè ba màu', price: 20000, images: ['https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400'] },
];

export async function GET() {
  return NextResponse.json({ products: MOCK_PRODUCTS, pagination: { totalEntries: MOCK_PRODUCTS.length } });
}
