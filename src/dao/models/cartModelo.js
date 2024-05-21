import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  items: [{
    item: { type: mongoose.Types.ObjectId, ref: 'productos' },
    cantidad: Number
  }]
}, {
  timestamps: true
});

const Cart = mongoose.model('carts', cartSchema); // Registra el modelo "cart" en Mongoose

export default Cart;