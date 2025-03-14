const mongoose = require("mongoose")

const ThirdPartyProviderSchema = new mongoose.Schema({
  provider_name: {
    type: String,
    default: null,
  },
  provider_id: {
    type: String,
    default: null,
  },
  provider_data: {
    type: {},
    default: null,
  },
})

// Create Schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    email_is_verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    referral_code: {
      type: String,
      default: function () {
        let hash = 0
        for (let i = 0; i < this.email.length; i++) {
          hash = this.email.charCodeAt(i) + ((hash << 5) - hash)
        }
        let res = (hash & 0x00ffffff).toString(16).toUpperCase()
        return "00000".substring(0, 6 - res.length) + res
      },
    },
    referred_by: {
      type: String,
      default: null,
    },
    third_party_auth: [ThirdPartyProviderSchema],
  },
  { strict: false, timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

module.exports = mongoose.model("users", UserSchema)
