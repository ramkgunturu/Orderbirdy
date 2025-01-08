const types = {
  ADD_TO_WHISHLIST: "ADD_TO_WHISHLIST",
  REMOVE_FROM_WHISHLIST: "REMOVE_FROM_WHISHLIST",
  EMPTY_WHISHLIST: "EMPTY_WHISHLIST",
};

export const actions = {
  addToWhishlist: (dispatch, product) => {
    dispatch({
      type: types.ADD_TO_WHISHLIST,
      product,
    });
  },
  removeFromWhishlist: (dispatch, product) => {
    dispatch({
      type: types.REMOVE_FROM_WHISHLIST,
      product,
    });
  },
  emptyWhishlist: (dispatch, product) => {
    dispatch({
      type: types.EMPTY_WHISHLIST,
      product,
    });
  },
};

const initialState = {
  whishlistItems: [],
};
export const reducer = (state = initialState, action) => {
  const { type } = action;
  switch (type) {
    case types.ADD_TO_WHISHLIST: {
      return {
        whishlistItems: [...state.whishlistItems, action.product],
      };
    }
    case types.REMOVE_FROM_WHISHLIST: {
      // state.whishlistItems.filter((item) => {
      //   console.log(item.id, "======", action.product.id);
      // });

      return {
        // whishlistItems: state.whishlistItems,
        whishlistItems: state.whishlistItems.filter(
          (item) => item.id !== action.product.id
        ),
      };
    }
    case types.EMPTY_WHISHLIST: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};
