import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {

    name: { 
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },

    supplier: {
      type: String,
      required: true,
    },

    expirAt: {
        type:Date,
        required: true,
    },

    manuAt: {
        type:Date,
        required: true,
    },

    storageCondition: {
        type:String,
        required:true,
    },
    type: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },
      

  },
  { timestamps: true }
);

const Inventory = mongoose.model('Inventory', inventorySchema);  //Create model

export default Inventory;