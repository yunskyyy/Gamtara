/**
 * GAMTARA ROLE NOMENCLATURE MAPPER
 * Single Source of Truth untuk penamaan peran berdasarkan konteks UI.
 */

export type DbRoleEnum = "customer" | "vendor" | "guide" | "admin" | "user" | "pengguna" | "penyedia" | "pemandu";
export type UIContext = "public" | "transaction";

// Dictionary Standar Nomenklatur
const RoleDictionary = {
  CUSTOMER: {
    public: "Wisatawan",
    transaction: "Pemesan",
  },
  VENDOR: {
    public: "Penyedia Alat",
    transaction: "Penyedia Alat",
  },
  GUIDE: {
    public: "Pemandu Lokal",
    transaction: "Pemandu Wisata",
  },
  ADMIN: {
    public: "SuperAdmin",
    transaction: "SuperAdmin",
  }
};

export function getRoleLabel(dbRole: string | undefined | null, context: UIContext = "public"): string {
  if (!dbRole) return "";

  const role = dbRole.toLowerCase();
  let normalizedKey: keyof typeof RoleDictionary = "CUSTOMER";

  // Normalisasi Enum Database ke Kunci Dictionary
  if (["customer", "user", "pengguna"].includes(role)) {
    normalizedKey = "CUSTOMER";
  } else if (["vendor", "pemilik", "penyedia", "tool_provider"].includes(role)) {
    normalizedKey = "VENDOR";
  } else if (["guide", "pemandu", "tour_guide"].includes(role)) {
    normalizedKey = "GUIDE";
  } else if (["admin", "superadmin"].includes(role)) {
    normalizedKey = "ADMIN";
  }

  return RoleDictionary[normalizedKey][context];
}