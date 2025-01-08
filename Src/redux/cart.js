const types = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  EMPTY_CART: "EMPTY_CART",
  REPLACE_CART_ITEM: "REPLACE_CART_ITEM",
  ALREADYEXIST_CART_ITEM: "ALREADYEXIST_CART_ITEM",
};

export const actions = {
  addToCart: (dispatch, product) => {
    dispatch({
      type: types.ADD_TO_CART,
      product,
    });
  },
  removeFromCart: (dispatch, product) => {
    dispatch({
      type: types.REMOVE_FROM_CART,
      product,
    });
  },
  emptyCart: (dispatch, product) => {
    dispatch({
      type: types.EMPTY_CART,
      product,
    });
  },
  replaceCartItem: (dispatch, productsArray) => {
    dispatch({
      type: types.REPLACE_CART_ITEM,
      productsArray,
    });
  },
  alreadyExistCartItem: (dispatch, product) => {
    dispatch({
      type: types.ALREADYEXIST_CART_ITEM,
      product,
    });
  },
};

const initialState = {
  cartItems: [],
  totalPrice: 0,
};
export const reducer = (state = initialState, action) => {
  const compareCartItem = (cartItem, action) => {
    return cartItem.id === action.product.id;
  };
  const compareCartItemWithUnique = (cartItem, action) => {
    // console.log("cartItem", cartItem.id, action.product.id)
    return (
      cartItem.id === action.product.id &&
      cartItem.uniqueId === action.product.uniqueId
    );
  };
  const { type } = action;
  switch (type) {
    case types.ADD_TO_CART: {
      const isExisted = state.cartItems.some((cartItem) =>
        compareCartItem(cartItem, action)
      );
      const isExistedUnique = state.cartItems.some((cartItem) =>
        compareCartItemWithUnique(cartItem, action)
      );
      var newCartItems = state.cartItems;
      var subTotal = 0;

      if (isExisted) {
        state.cartItems.map((item, key) => {
          // console.log(
          //   item.uniqueId,
          //   action.product.uniqueId,
          //   item.id,
          //   action.product.id,
          //   action.product.quantity
          // );
          if (item.id === action.product.id) {
            if (
              item.uniqueId === action.product.uniqueId &&
              item.id === action.product.id
            ) {
              item.quantity = action.product.quantity;
            }
            // else {
            //   item.quantity =
            //     parseInt(item.quantity) + parseInt(action.product.quantity);
            // }

            // item.color = action.product.color;
            // item.size = action.product.size;
            // console.log("Executing");
            // console.log(item, "item");
            // console.log(action.product, "product");
            // console.log(parseFloat(item.price), parseInt(item.quantity));
            // console.log(parseFloat(item.price) * parseInt(item.quantity));
          }
          subTotal += parseFloat(item.totalCost) * parseInt(item.quantity);
        });
        newCartItems = state.cartItems;
      } else if (isExistedUnique) {
        state.cartItems.map((item, key) => {
          if (item.id === action.product.id) {
            if (item.uniqueId === action.product.uniqueId) {
              item.quantity = action.product.quantity;
            } else {
              item.quantity =
                parseInt(item.quantity) + parseInt(action.product.quantity);
            }
          }
          subTotal += parseFloat(item.totalCost) * parseInt(item.quantity);
        });
        newCartItems = state.cartItems;
      } else {
        newCartItems = [...state.cartItems, action.product];
        newCartItems.map((item, key) => {
          subTotal += parseFloat(item.totalCost) * parseInt(item.quantity);
        });
      }

      return {
        cartItems: newCartItems,
        totalPrice: subTotal,
      };
    }
    case types.ALREADYEXIST_CART_ITEM: {
      newCartItems = [...state.cartItems, action.product];
      newCartItems.map((item, key) => {
        subTotal += parseFloat(item.totalCost) * parseInt(item.quantity);
      });

      return {
        cartItems: newCartItems,
        totalPrice: subTotal,
      };
    }
    case types.REMOVE_FROM_CART: {
      let newCart = state.cartItems.filter(
        (item) => item.uniqueId !== action.product.uniqueId
      );

      let total = 0;
      newCart.map((res, key) => {
        total += parseFloat(res.totalCost);
      });

      return {
        cartItems: newCart,
        totalPrice: total,
      };
    }
    case types.EMPTY_CART: {
      return initialState;
    }
    case types.REPLACE_CART_ITEM: {
      return {
        cartItems: [...state.cartItems],
        totalPrice: state.total,
      };
    }
    default: {
      return state;
    }
  }
};
