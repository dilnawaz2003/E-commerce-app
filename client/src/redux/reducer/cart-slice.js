import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
  user: "",
  subTotal: 0,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
  status: "",
  orderItems: [],
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const index = state.orderItems.findIndex(
        (order) => order.productId === action.payload.productId
      );

      if (index === -1) {
        state.orderItems.push(action.payload);
        toast.success("Item added to  cart");
      } else {
        toast.error("Item already in cart");
      }
      cartSlice.caseReducers.calculatePrice(state);
    },

    removeFromCart: (state, action) => {
      state.orderItems = state.orderItems.filter((item) => {
        console.log(item.productId != action.payload);
        return item.productId != action.payload;
      });
      toast.success("Item removed from  cart");
      cartSlice.caseReducers.calculatePrice(state);
    },

    incrementQuantity: (state, action) => {
      const orderItem = state.orderItems.find(
        (item) => item.productId === action.payload
      );

      if (orderItem.stock > orderItem.quantity) {
        orderItem.quantity += 1;
        cartSlice.caseReducers.calculatePrice(state);
      } else {
        toast.error("reached maximum stock");
      }
    },

    decrementQuantity: (state, action) => {
      const orderItem = state.orderItems.find(
        (item) => item.productId === action.payload
      );
      if (orderItem.quantity > 1) {
        orderItem.quantity -= 1;
        cartSlice.caseReducers.calculatePrice(state);
      }
    },

    calculatePrice: (state) => {
      state.subTotal = state.orderItems.reduce(
        (total, currItem) => (total += currItem.quantity * currItem.price),
        0
      );

      // for order which is less then 10k we will charge 500 .
      state.shippingCharges =
        state.orderItems.length != 0 && state.subTotal < 10000 ? 500 : 0;

      state.tax = Math.round(state.subTotal * 0.05); // we will consider that tax is 5% on every order.

      state.total =
        state.subTotal + state.tax + state.shippingCharges - state.discount;
    },

    applyDiscount: (state, action) => {
      state.discount = action.payload;
      cartSlice.caseReducers.calculatePrice(state);
    },

    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },

    resetCart: () => initialState,
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  applyDiscount,
  setShippingInfo,
  resetCart,
} = cartSlice.actions;
export { cartSlice };
