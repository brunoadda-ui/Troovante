/* @ds-bundle: {"format":4,"namespace":"NikeRetailDesignSystem_5e7285","components":[{"name":"Wordmark","sourcePath":"components/brand/Wordmark.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"FilterChip","sourcePath":"components/buttons/FilterChip.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"CampaignTile","sourcePath":"components/content/CampaignTile.jsx"},{"name":"CategoryIconCard","sourcePath":"components/content/CategoryIconCard.jsx"},{"name":"DisclosureRow","sourcePath":"components/content/DisclosureRow.jsx"},{"name":"MemberBenefitCard","sourcePath":"components/content/MemberBenefitCard.jsx"},{"name":"SearchPill","sourcePath":"components/forms/SearchPill.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"Photo","sourcePath":"components/media/Photo.jsx"},{"name":"FilterSidebar","sourcePath":"components/navigation/FilterSidebar.jsx"},{"name":"PrimaryNav","sourcePath":"components/navigation/PrimaryNav.jsx"},{"name":"SiteFooter","sourcePath":"components/navigation/SiteFooter.jsx"},{"name":"SubNav","sourcePath":"components/navigation/SubNav.jsx"},{"name":"UtilityBar","sourcePath":"components/navigation/UtilityBar.jsx"},{"name":"PriceRow","sourcePath":"components/product/PriceRow.jsx"},{"name":"ProductCard","sourcePath":"components/product/ProductCard.jsx"},{"name":"PromoBadge","sourcePath":"components/product/PromoBadge.jsx"},{"name":"SwatchDots","sourcePath":"components/product/SwatchDots.jsx"}],"sourceHashes":{"components/brand/Wordmark.jsx":"7b94b45f54d5","components/buttons/Button.jsx":"2a4bce013703","components/buttons/FilterChip.jsx":"dfe76639936c","components/buttons/IconButton.jsx":"1b425fb385dd","components/content/CampaignTile.jsx":"9d31c276b77e","components/content/CategoryIconCard.jsx":"de03f22b673e","components/content/DisclosureRow.jsx":"2d03ebda8457","components/content/MemberBenefitCard.jsx":"e2e981432d04","components/forms/SearchPill.jsx":"9e243a397060","components/icons/Icon.jsx":"ca53a2e4fa1d","components/media/Photo.jsx":"629bef076d37","components/navigation/FilterSidebar.jsx":"23b6a5e08d91","components/navigation/PrimaryNav.jsx":"2126f3552369","components/navigation/SiteFooter.jsx":"504c883949b6","components/navigation/SubNav.jsx":"8e5b293cdfd5","components/navigation/UtilityBar.jsx":"d95cd966a705","components/product/PriceRow.jsx":"3b4601d42e89","components/product/ProductCard.jsx":"0e1149f98552","components/product/PromoBadge.jsx":"2f15f1d936ad","components/product/SwatchDots.jsx":"a99cd0daf2cb","ui_kits/retail-web/Home.jsx":"2a43b5237e0c","ui_kits/retail-web/Listing.jsx":"058be898a2d9","ui_kits/retail-web/Membership.jsx":"5cd7556a09e2","ui_kits/retail-web/ProductDetail.jsx":"d341695f4bf7","ui_kits/retail-web/Shell.jsx":"338d5e986afa"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NikeRetailDesignSystem_5e7285 = window.NikeRetailDesignSystem_5e7285 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Wordmark.jsx
try { (() => {
function Wordmark({
  size = 20,
  color = "var(--ink)",
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body-strong)",
      fontSize: size,
      lineHeight: 1,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      fontWeight: 700,
      color,
      ...style
    }
  }, "Nike");
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
const VARIANTS = {
  primary: {
    background: "var(--ink)",
    color: "var(--canvas)",
    border: "none"
  },
  secondary: {
    background: "var(--soft-cloud)",
    color: "var(--ink)",
    border: "none"
  },
  "on-image": {
    background: "var(--canvas)",
    color: "var(--ink)",
    border: "none"
  },
  inverse: {
    background: "var(--canvas)",
    color: "var(--ink)",
    border: "none"
  }
};
const SIZES = {
  lg: {
    font: "var(--type-button-lg)",
    padding: "16px 32px",
    minHeight: 56
  },
  md: {
    font: "var(--type-button-md)",
    padding: "16px 32px",
    minHeight: "var(--height-button)"
  },
  sm: {
    font: "var(--type-button-sm)",
    padding: "12px 24px",
    minHeight: 40
  }
};
function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  full = false,
  type = "button",
  onClick,
  style
}) {
  const [pressed, setPressed] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      ...VARIANTS[variant],
      font: s.font,
      padding: s.padding,
      minHeight: s.minHeight,
      width: full ? "100%" : "auto",
      borderRadius: "var(--radius-button)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-sm)",
      cursor: disabled ? "default" : "pointer",
      boxShadow: "none",
      whiteSpace: "nowrap",
      opacity: disabled ? 0.5 : pressed ? "var(--press-opacity)" : 1,
      transform: pressed ? "scale(0.96)" : "none",
      transition: "opacity var(--duration-press) var(--ease-press), transform var(--duration-press) var(--ease-press)",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/FilterChip.jsx
try { (() => {
function FilterChip({
  children,
  active = false,
  count,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-pressed": active,
    onClick: onClick,
    style: {
      font: "var(--type-button-md)",
      padding: "8px 16px",
      height: "var(--height-chip)",
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-xs)",
      borderRadius: "var(--radius-chip)",
      background: active ? "var(--ink)" : "var(--canvas)",
      color: active ? "var(--canvas)" : "var(--ink)",
      border: active ? "1px solid var(--ink)" : "1px solid var(--hairline)",
      cursor: "pointer",
      whiteSpace: "nowrap",
      ...style
    }
  }, children, count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      color: active ? "var(--stone)" : "var(--mute)"
    }
  }, "(", count, ")"));
}
Object.assign(__ds_scope, { FilterChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/FilterChip.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
/* Lucide is a SUBSTITUTE icon set — no Nike icon assets were supplied.
   Requires the lucide UMD script on the page (see any @dsCard HTML). */
function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  color = "currentColor",
  style
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = `<i data-lucide="${name}"></i>`;
    window.lucide.createIcons({
      nameAttr: "data-lucide",
      attrs: {
        width: size,
        height: size,
        "stroke-width": strokeWidth,
        stroke: color
      },
      root: el
    });
  }, [name, size, strokeWidth, color]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    "aria-hidden": "true",
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      flex: "0 0 auto",
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function IconButton({
  icon,
  label,
  size = 40,
  variant = "soft",
  onClick,
  style
}) {
  const [pressed, setPressed] = React.useState(false);
  const bg = variant === "soft" ? "var(--soft-cloud)" : variant === "solid" ? "var(--ink)" : "transparent";
  const fg = variant === "solid" ? "var(--canvas)" : "var(--ink)";
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    onClick: onClick,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      width: size,
      height: size,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: bg,
      color: fg,
      border: "none",
      borderRadius: "var(--radius-full)",
      cursor: "pointer",
      padding: 0,
      opacity: pressed ? "var(--press-opacity)" : 1,
      transition: "opacity var(--duration-press) var(--ease-press)",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.5),
    color: fg
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/content/CategoryIconCard.jsx
try { (() => {
function CategoryIconCard({
  label,
  icon = "shirt",
  image,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      background: "var(--canvas)",
      border: "none",
      borderRadius: "var(--radius-tile)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--space-md)",
      padding: "var(--space-md) 0",
      cursor: "pointer",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 80,
      height: 80,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--soft-cloud)",
      borderRadius: "var(--radius-full)",
      overflow: "hidden"
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 40,
    color: "var(--ink)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-caption-md)",
      color: "var(--ink)"
    }
  }, label));
}
Object.assign(__ds_scope, { CategoryIconCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/CategoryIconCard.jsx", error: String((e && e.message) || e) }); }

// components/content/DisclosureRow.jsx
try { (() => {
function DisclosureRow({
  label,
  children,
  emphasis = "body",
  defaultOpen = false,
  style
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: "var(--divider-hairline)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-expanded": open,
    onClick: () => setOpen(o => !o),
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-md)",
      padding: "var(--pad-disclosure-row) 0",
      background: "transparent",
      border: "none",
      textAlign: "left",
      cursor: "pointer",
      font: emphasis === "heading" ? "var(--type-heading-md)" : "var(--type-body-strong)",
      color: "var(--ink)"
    }
  }, label, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: open ? "chevron-up" : "chevron-down",
    size: 20,
    color: "var(--ink)"
  })), open && children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body-md)",
      color: "var(--charcoal)",
      paddingBottom: "var(--pad-disclosure-row)",
      maxWidth: 620
    }
  }, children));
}
Object.assign(__ds_scope, { DisclosureRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/DisclosureRow.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchPill.jsx
try { (() => {
function SearchPill({
  value,
  onChange,
  placeholder = "Search",
  width = 180,
  expandedWidth = 260,
  style
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-sm)",
      height: 40,
      padding: "8px 16px",
      width: focused ? expandedWidth : width,
      borderRadius: "var(--radius-input)",
      background: focused ? "var(--canvas)" : "var(--soft-cloud)",
      border: focused ? "2px solid var(--ink)" : "2px solid transparent",
      boxShadow: focused ? "var(--focus-ring)" : "none",
      transition: "width 150ms var(--ease-press), background 150ms var(--ease-press)",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 20,
    color: "var(--ink)"
  }), /*#__PURE__*/React.createElement("input", {
    value: value,
    placeholder: placeholder,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      font: "var(--type-body-md)",
      color: "var(--ink)",
      border: "none",
      outline: "none",
      background: "transparent",
      width: "100%",
      minWidth: 0,
      padding: 0
    }
  }));
}
Object.assign(__ds_scope, { SearchPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchPill.jsx", error: String((e && e.message) || e) }); }

// components/media/Photo.jsx
try { (() => {
const CAPTION_POS = {
  center: {
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  },
  "top-right": {
    top: 0,
    right: 0,
    maxWidth: "52%",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    textAlign: "right"
  },
  "bottom-right": {
    bottom: 0,
    right: 0,
    maxWidth: "52%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    textAlign: "right"
  }
};
function Photo({
  src,
  alt = "",
  ratio = "1 / 1",
  stage = true,
  label = "Product photography",
  captionAlign = "center",
  radius = "var(--radius-none)",
  style,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: ratio,
      width: "100%",
      overflow: "hidden",
      background: stage ? "var(--soft-cloud)" : "var(--ink)",
      borderRadius: radius,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      display: "flex",
      font: "var(--type-caption-sm)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: stage ? "var(--stone)" : "var(--ash)",
      padding: "var(--space-md)",
      ...(CAPTION_POS[captionAlign] || CAPTION_POS.center)
    }
  }, label), children);
}
Object.assign(__ds_scope, { Photo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/Photo.jsx", error: String((e && e.message) || e) }); }

// components/content/CampaignTile.jsx
try { (() => {
function CampaignTile({
  eyebrow,
  headline,
  body,
  cta,
  onCta,
  image,
  imageLabel = "Campaign photography",
  ratio = "16 / 9",
  headlineColor = "var(--canvas)",
  align = "bottom-left",
  headlineSize = 96,
  style
}) {
  const pos = align === "top-left" ? {
    top: "var(--space-section)",
    left: "var(--space-section)"
  } : {
    bottom: "var(--space-section)",
    left: "var(--space-section)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: "var(--radius-tile)",
      overflow: "hidden",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Photo, {
    src: image,
    ratio: ratio,
    stage: false,
    label: imageLabel,
    captionAlign: align === "top-left" ? "bottom-right" : "top-right"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      maxWidth: "min(80%, 900px)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-xl)",
      ...pos
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-caption-md)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: headlineColor
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: "var(--type-display-campaign)",
      fontSize: headlineSize,
      letterSpacing: "var(--tracking-campaign)",
      textTransform: "uppercase",
      whiteSpace: "pre-line",
      color: headlineColor
    }
  }, headline), body && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--type-body-md)",
      color: headlineColor,
      maxWidth: 460
    }
  }, body), cta && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "on-image",
    size: "sm",
    onClick: onCta
  }, cta))));
}
Object.assign(__ds_scope, { CampaignTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/CampaignTile.jsx", error: String((e && e.message) || e) }); }

// components/content/MemberBenefitCard.jsx
try { (() => {
function MemberBenefitCard({
  title,
  body,
  cta = "Explore",
  onCta,
  image,
  imageLabel = "Member benefit photography",
  ratio = "4 / 5",
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: "var(--ink)",
      borderRadius: "var(--radius-tile)",
      overflow: "hidden",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Photo, {
    src: image,
    ratio: ratio,
    stage: false,
    label: imageLabel,
    captionAlign: "top-right"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "var(--space-xl)",
      right: "var(--space-xl)",
      bottom: "var(--space-xl)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-heading-lg)",
      color: "var(--canvas)"
    }
  }, title), body && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body-md)",
      color: "var(--canvas)"
    }
  }, body), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "on-image",
    size: "sm",
    onClick: onCta
  }, cta))));
}
Object.assign(__ds_scope, { MemberBenefitCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/MemberBenefitCard.jsx", error: String((e && e.message) || e) }); }

// components/navigation/FilterSidebar.jsx
try { (() => {
function FilterSidebar({
  groups = [],
  selected = {},
  onToggle,
  width = 220,
  style
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width,
      flex: `0 0 ${width}px`,
      background: "var(--canvas)",
      borderRadius: "var(--radius-none)",
      ...style
    }
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.label,
    style: {
      padding: "var(--space-lg) 0",
      borderBottom: "var(--divider-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body-strong)",
      color: "var(--ink)",
      marginBottom: "var(--space-md)"
    }
  }, g.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)"
    }
  }, g.options.map(o => {
    const isOn = (selected[g.label] || []).includes(o.label);
    return /*#__PURE__*/React.createElement("button", {
      key: o.label,
      type: "button",
      onClick: () => onToggle && onToggle(g.label, o.label),
      style: {
        font: "var(--type-caption-md)",
        color: "var(--ink)",
        background: "none",
        border: "none",
        padding: 0,
        textAlign: "left",
        display: "flex",
        gap: "var(--space-xs)",
        cursor: "pointer",
        borderBottom: isOn ? "1px solid var(--ink)" : "1px solid transparent",
        alignSelf: "flex-start"
      }
    }, o.label, o.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--mute)"
      }
    }, "(", o.count, ")"));
  })))));
}
Object.assign(__ds_scope, { FilterSidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/FilterSidebar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/PrimaryNav.jsx
try { (() => {
function PrimaryNav({
  items = ["New & Featured", "Men", "Women", "Kids", "Jordan", "Sport"],
  active,
  onSelect,
  query,
  onQueryChange,
  onLogo,
  bagCount,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      background: "var(--canvas)",
      height: "var(--height-primary-nav)",
      display: "flex",
      alignItems: "center",
      gap: "var(--space-xl)",
      padding: "0 var(--space-xl)",
      borderRadius: "var(--radius-none)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onLogo,
    style: {
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      flex: "0 0 auto"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "stretch",
      gap: "var(--space-xl)",
      margin: "0 auto",
      height: "100%"
    }
  }, items.map(it => {
    const isActive = it === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it,
      type: "button",
      onClick: () => onSelect && onSelect(it),
      style: {
        font: "var(--type-body-strong)",
        color: "var(--ink)",
        background: "none",
        border: "none",
        borderBottom: isActive ? "2px solid var(--ink)" : "2px solid transparent",
        padding: "0 var(--space-xxs)",
        cursor: "pointer",
        whiteSpace: "nowrap"
      }
    }, it);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-sm)",
      flex: "0 0 auto"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SearchPill, {
    value: query,
    onChange: onQueryChange
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "heart",
    label: "Favourites",
    variant: "ghost"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "shopping-bag",
    label: "Bag",
    variant: "ghost"
  }), bagCount ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      right: 0,
      minWidth: 16,
      height: 16,
      borderRadius: "var(--radius-full)",
      background: "var(--ink)",
      color: "var(--canvas)",
      font: "var(--type-utility-xs)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 4px"
    }
  }, bagCount) : null)));
}
Object.assign(__ds_scope, { PrimaryNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/PrimaryNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteFooter.jsx
try { (() => {
const DEFAULT_COLUMNS = [{
  label: "Resources",
  links: ["Find a Store", "Become a Member", "Running Shoe Finder", "Send Us Feedback"]
}, {
  label: "Help",
  links: ["Get Help", "Order Status", "Delivery", "Returns", "Contact Us"]
}, {
  label: "Company",
  links: ["About Nike", "News", "Careers", "Investors", "Sustainability"]
}, {
  label: "Promotions & Discounts",
  links: ["Student", "Military", "Teacher", "First Responders", "Birthday"]
}];
function SiteFooter({
  columns = DEFAULT_COLUMNS,
  locale = "United Kingdom",
  legal = "© 2026 Nike, Inc. All Rights Reserved",
  legalLinks = ["Guides", "Terms of Sale", "Terms of Use", "Nike Privacy Policy"],
  style
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--canvas)",
      borderTop: "var(--divider-hairline)",
      padding: "var(--space-section) var(--space-xl) var(--space-xl)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "var(--space-xl)"
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.label,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body-strong)",
      color: "var(--ink)"
    }
  }, c.label), c.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      font: "var(--type-caption-md)",
      color: "var(--mute)",
      textDecoration: "none"
    }
  }, l))))), /*#__PURE__*/React.createElement("hr", {
    style: {
      border: "none",
      borderTop: "var(--divider-hairline)",
      margin: "var(--space-xxl) 0 var(--space-lg)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-lg)",
      font: "var(--type-utility-xs)",
      color: "var(--mute)"
    }
  }, /*#__PURE__*/React.createElement("span", null, locale), /*#__PURE__*/React.createElement("span", null, legal), legalLinks.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      color: "var(--mute)",
      textDecoration: "none",
      font: "inherit"
    }
  }, l))));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SubNav.jsx
try { (() => {
function SubNav({
  breadcrumb = [],
  title,
  count,
  filtersHidden = false,
  onToggleFilters,
  sort = "Featured",
  onSort,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--canvas)",
      boxShadow: "var(--elevation-inset-bottom)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-xl)",
      padding: "var(--space-lg) var(--space-xl)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "var(--space-md)",
      minWidth: 0
    }
  }, breadcrumb.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-caption-md)",
      color: "var(--mute)"
    }
  }, breadcrumb.join(" / ")), title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-heading-lg)",
      color: "var(--ink)"
    }
  }, title, count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-caption-md)",
      color: "var(--mute)",
      marginLeft: "var(--space-sm)"
    }
  }, "(", count, ")"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-xl)",
      flex: "0 0 auto"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onToggleFilters,
    style: {
      font: "var(--type-button-md)",
      color: "var(--ink)",
      background: "none",
      border: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-sm)",
      cursor: "pointer"
    }
  }, filtersHidden ? "Show Filters" : "Hide Filters", /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "sliders-horizontal",
    size: 18,
    color: "var(--ink)"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onSort,
    style: {
      font: "var(--type-button-md)",
      color: "var(--ink)",
      background: "none",
      border: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-sm)",
      cursor: "pointer"
    }
  }, "Sort By: ", sort, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 18,
    color: "var(--ink)"
  }))));
}
Object.assign(__ds_scope, { SubNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SubNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/UtilityBar.jsx
try { (() => {
function UtilityBar({
  links = ["Find a Store", "Help", "Join Us", "Sign In"],
  onLink,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--soft-cloud)",
      height: "var(--height-utility-bar)",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "var(--space-md)",
      padding: "0 var(--space-xl)",
      font: "var(--type-caption-sm)",
      color: "var(--ink)",
      borderRadius: "var(--radius-none)",
      ...style
    }
  }, links.map((l, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: l
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--hairline)"
    }
  }, "|"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => onLink && onLink(l),
    style: {
      font: "inherit",
      color: "inherit",
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer"
    }
  }, l))));
}
Object.assign(__ds_scope, { UtilityBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/UtilityBar.jsx", error: String((e && e.message) || e) }); }

// components/product/PriceRow.jsx
try { (() => {
function PriceRow({
  price,
  compareAt,
  percentOff,
  style
}) {
  const onSale = compareAt != null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "var(--space-sm)",
      font: "var(--type-body-strong)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: onSale ? "var(--sale)" : "var(--ink)"
    }
  }, price), onSale && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--mute)",
      textDecoration: "line-through"
    }
  }, compareAt), onSale && percentOff != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-caption-md)",
      color: "var(--sale)"
    }
  }, percentOff, "% off"));
}
Object.assign(__ds_scope, { PriceRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/PriceRow.jsx", error: String((e && e.message) || e) }); }

// components/product/PromoBadge.jsx
try { (() => {
function PromoBadge({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      font: "var(--type-caption-sm)",
      padding: "4px 12px",
      borderRadius: "var(--radius-badge)",
      background: "var(--canvas)",
      color: "var(--ink)",
      border: "1px solid var(--hairline)",
      whiteSpace: "nowrap",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { PromoBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/PromoBadge.jsx", error: String((e && e.message) || e) }); }

// components/product/SwatchDots.jsx
try { (() => {
function SwatchDots({
  colors = [],
  activeIndex = 0,
  onSelect,
  size = 12,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-xs)",
      alignItems: "center",
      ...style
    }
  }, colors.map((c, i) => {
    const active = i === activeIndex;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      "aria-label": `Colourway ${i + 1}`,
      "aria-pressed": active,
      onClick: () => onSelect && onSelect(i),
      style: {
        width: active ? size + 8 : size,
        height: active ? size + 8 : size,
        padding: 0,
        borderRadius: "var(--radius-full)",
        background: c,
        border: active ? "2px solid var(--ink)" : "1px solid var(--hairline)",
        boxShadow: active ? "inset 0 0 0 2px var(--canvas)" : "none",
        cursor: "pointer",
        flex: "0 0 auto"
      }
    });
  }));
}
Object.assign(__ds_scope, { SwatchDots });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/SwatchDots.jsx", error: String((e && e.message) || e) }); }

// components/product/ProductCard.jsx
try { (() => {
function ProductCard({
  name,
  category,
  price,
  compareAt,
  percentOff,
  badge,
  colors = [],
  colorCount,
  image,
  imageLabel = "Product photography",
  ratio = "1 / 1",
  onClick,
  style
}) {
  const [active, setActive] = React.useState(0);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      background: "var(--canvas)",
      borderRadius: "var(--radius-card)",
      padding: 0,
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Photo, {
    src: image,
    alt: name,
    ratio: ratio,
    label: imageLabel
  }, badge && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "var(--space-md)",
      left: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PromoBadge, null, badge))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--gap-card-meta)",
      paddingTop: "var(--space-md)"
    }
  }, colors.length > 0 && /*#__PURE__*/React.createElement(__ds_scope.SwatchDots, {
    colors: colors,
    activeIndex: active,
    onSelect: setActive
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body-strong)",
      color: "var(--ink)"
    }
  }, name), category && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-caption-md)",
      color: "var(--mute)"
    }
  }, category), colorCount != null && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-caption-sm)",
      color: "var(--mute)"
    }
  }, colorCount, " Colours"), /*#__PURE__*/React.createElement(__ds_scope.PriceRow, {
    price: price,
    compareAt: compareAt,
    percentOff: percentOff
  })));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/ProductCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/retail-web/Home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  CampaignTile,
  ProductCard,
  CategoryIconCard,
  Photo,
  Button
} = window.NikeRetailDesignSystem_5e7285;
const TRENDING = [{
  name: "ACG Zegama",
  category: "Men's Trail Running Shoes",
  price: "$185",
  colors: ["#111111", "#f5f5f5", "#0a7281"],
  colorCount: 4,
  imageLabel: "Trail shoe, lateral view"
}, {
  name: "Pegasus Trail 5 GORE-TEX",
  category: "Men's Waterproof Trail Shoes",
  price: "$129.97",
  compareAt: "$185",
  percentOff: 29,
  colors: ["#39393b", "#beaffd"],
  colorCount: 2,
  imageLabel: "Trail shoe, 3/4 view"
}, {
  name: "Dri-FIT ADV Run Division",
  category: "Men's Running Top",
  price: "$110",
  badge: "Just In",
  colors: ["#111111", "#ed1aa0"],
  colorCount: 3,
  imageLabel: "Running top, flat lay"
}];
const SPORTS = ["Running", "Training", "Basketball", "Football", "Golf"];
const CLOTHING = [{
  label: "Tops & T-Shirts",
  icon: "shirt"
}, {
  label: "Hoodies",
  icon: "shirt"
}, {
  label: "Shorts",
  icon: "scissors"
}, {
  label: "Trousers",
  icon: "move-vertical"
}, {
  label: "Jackets",
  icon: "wind"
}, {
  label: "Socks",
  icon: "footprints"
}];
function Home({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CampaignTile, {
    eyebrow: "Nike Trail",
    headline: "Run\nthe\nline",
    cta: "Shop Trail",
    onCta: () => go("listing"),
    ratio: "21 / 9",
    headlineSize: 96,
    imageLabel: "Runner on a ridge line \u2014 21:9 crop"
  }), /*#__PURE__*/React.createElement(Container, {
    style: {
      marginTop: "var(--rhythm-section)"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Trending Now",
    action: "Shop All",
    onAction: () => go("listing")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--gap-grid)"
    }
  }, TRENDING.map(p => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: p.name
  }, p, {
    onClick: () => go("pdp")
  }))))), /*#__PURE__*/React.createElement(Container, {
    style: {
      marginTop: "var(--rhythm-section)"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Shop by Sport"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridAutoFlow: "column",
      gridAutoColumns: "minmax(240px, 1fr)",
      gap: "var(--gap-grid)",
      overflowX: "auto"
    }
  }, SPORTS.map(s => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    ratio: "4 / 5",
    stage: false,
    label: `${s} photography, 4:5`
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "var(--space-xl)",
      bottom: "var(--space-xl)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "on-image",
    size: "sm",
    onClick: () => go("listing")
  }, s)))))), /*#__PURE__*/React.createElement(Container, {
    style: {
      marginTop: "var(--rhythm-section)"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Latest in Clothing"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: "var(--gap-grid)"
    }
  }, CLOTHING.map(c => /*#__PURE__*/React.createElement(CategoryIconCard, {
    key: c.label,
    label: c.label,
    icon: c.icon,
    onClick: () => go("listing")
  })))), /*#__PURE__*/React.createElement(Container, {
    style: {
      marginTop: "var(--rhythm-section)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--gap-grid)"
    }
  }, /*#__PURE__*/React.createElement(CampaignTile, {
    headline: "Member\nonly",
    body: "Free shipping, exclusive drops and a birthday reward.",
    cta: "Join Us",
    onCta: () => go("membership"),
    ratio: "4 / 3",
    headlineSize: 64,
    imageLabel: "Membership photography, 4:3"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--soft-cloud)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "var(--space-xl)",
      padding: "var(--space-section)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-heading-xl)"
    }
  }, "Built for the trail"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body-md)",
      color: "var(--charcoal)",
      maxWidth: 420
    }
  }, "Aggressive traction, breathable uppers and rock plates for loose ground and long days out."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => go("listing")
  }, "Shop Trail Running"))))));
}
Object.assign(window, {
  Home
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/retail-web/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/retail-web/Listing.jsx
try { (() => {
const {
  SubNav,
  FilterSidebar,
  ProductCard,
  FilterChip
} = window.NikeRetailDesignSystem_5e7285;
const GROUPS = [{
  label: "Gender",
  options: [{
    label: "Men",
    count: 48
  }, {
    label: "Unisex",
    count: 6
  }]
}, {
  label: "Shop by Price",
  options: [{
    label: "Under $100"
  }, {
    label: "$100 - $150"
  }, {
    label: "Over $150"
  }]
}, {
  label: "Surface",
  options: [{
    label: "Trail",
    count: 22
  }, {
    label: "Road",
    count: 26
  }]
}, {
  label: "Technology",
  options: [{
    label: "GORE-TEX"
  }, {
    label: "ZoomX"
  }, {
    label: "React"
  }]
}];
const NAMES = [["ACG Zegama", "Men's Trail Running Shoes", "$185", null, null, ["#111111", "#f5f5f5", "#0a7281"]], ["Pegasus Trail 5 GORE-TEX", "Men's Waterproof Trail Shoes", "$129.97", "$185", 29, ["#39393b", "#beaffd"]], ["Wildhorse 8", "Men's Trail Running Shoes", "$140", null, null, ["#111111", "#d6d1ff"]], ["Ultrafly", "Men's Trail Racing Shoes", "$260", null, null, ["#ed1aa0", "#111111"]], ["Juniper Trail 3", "Men's Trail Running Shoes", "$85", "$100", 15, ["#4b4b4d", "#f5f5f5"]], ["Kiger 10", "Men's Trail Running Shoes", "$155", null, null, ["#0a7281", "#111111", "#ffb0dd"]]];
function Listing({
  go
}) {
  const [hidden, setHidden] = React.useState(false);
  const [selected, setSelected] = React.useState({
    Gender: ["Men"],
    Surface: ["Trail"]
  });
  const [sort, setSort] = React.useState("Featured");
  const toggle = (g, o) => setSelected(s => {
    const cur = s[g] || [];
    return {
      ...s,
      [g]: cur.includes(o) ? cur.filter(x => x !== o) : [...cur, o]
    };
  });
  const chips = Object.entries(selected).flatMap(([g, arr]) => arr.map(a => ({
    g,
    a
  })));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SubNav, {
    breadcrumb: ["Men", "Shoes"],
    title: "Men's Trail Running Shoes",
    count: 48,
    filtersHidden: hidden,
    onToggleFilters: () => setHidden(h => !h),
    sort: sort,
    onSort: () => setSort(s => s === "Featured" ? "Newest" : s === "Newest" ? "Price: Low-High" : "Featured")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-xl) var(--gutter-page)",
      display: "flex",
      gap: "var(--space-section)",
      alignItems: "flex-start"
    }
  }, !hidden && /*#__PURE__*/React.createElement(FilterSidebar, {
    groups: GROUPS,
    selected: selected,
    onToggle: toggle
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, chips.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-sm)",
      flexWrap: "wrap",
      marginBottom: "var(--space-xl)"
    }
  }, chips.map(({
    g,
    a
  }) => /*#__PURE__*/React.createElement(FilterChip, {
    key: g + a,
    active: true,
    onClick: () => toggle(g, a)
  }, a))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--gap-grid)"
    }
  }, NAMES.map(([name, category, price, compareAt, percentOff, colors], i) => /*#__PURE__*/React.createElement(ProductCard, {
    key: name,
    name: name,
    category: category,
    price: price,
    compareAt: compareAt || undefined,
    percentOff: percentOff || undefined,
    colors: colors,
    colorCount: colors.length,
    badge: i === 1 ? "Just In" : undefined,
    imageLabel: `${name} — product photography on soft cloud`,
    onClick: () => go("pdp")
  }))))));
}
Object.assign(window, {
  Listing
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/retail-web/Listing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/retail-web/Membership.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  CampaignTile,
  MemberBenefitCard,
  DisclosureRow,
  Button
} = window.NikeRetailDesignSystem_5e7285;
const BENEFITS = [{
  title: "Member Days",
  body: "Exclusive access to sale moments, twice a year."
}, {
  title: "Free Shipping",
  body: "On every order, no minimum spend."
}, {
  title: "Birthday Reward",
  body: "A gift in your inbox, every year."
}];
const FAQS = [["What is Nike Membership?", "Free to join. Members get exclusive products, offers, events and free shipping."], ["How do I join?", "Sign up with an email address in under a minute — online, in-app or in store."], ["Does it cost anything?", "No. Membership is free, always."], ["Can I use my membership in store?", "Yes — scan your member pass at the till."]];
function Membership({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CampaignTile, {
    eyebrow: "Nike Membership",
    headline: "Become\na member",
    body: "Sign up for free. Join the community. Get the products, offers and stories that move you.",
    cta: "Join Us",
    ratio: "21 / 9",
    headlineSize: 96,
    imageLabel: "Membership campaign photography, 21:9"
  }), /*#__PURE__*/React.createElement(Container, {
    style: {
      marginTop: "var(--rhythm-section)"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Member Benefits"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--gap-grid)"
    }
  }, BENEFITS.map(b => /*#__PURE__*/React.createElement(MemberBenefitCard, _extends({
    key: b.title
  }, b, {
    cta: "Explore",
    ratio: "4 / 5",
    imageLabel: `${b.title} photography, 4:5`
  }))))), /*#__PURE__*/React.createElement(Container, {
    style: {
      marginTop: "var(--rhythm-section)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--soft-cloud)",
      padding: "var(--space-section)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-xl)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-heading-lg)"
    }
  }, "Already a member? Sign in to shop the drop."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Sign In"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => go("listing")
  }, "Shop")))), /*#__PURE__*/React.createElement(Container, {
    style: {
      marginTop: "var(--rhythm-section)",
      maxWidth: 820
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "FAQs"
  }), FAQS.map(([q, a]) => /*#__PURE__*/React.createElement(DisclosureRow, {
    key: q,
    label: q,
    emphasis: "heading"
  }, a))));
}
Object.assign(window, {
  Membership
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/retail-web/Membership.jsx", error: String((e && e.message) || e) }); }

// ui_kits/retail-web/ProductDetail.jsx
try { (() => {
const {
  Photo,
  Button,
  IconButton,
  SwatchDots,
  PriceRow,
  DisclosureRow,
  ProductCard,
  PromoBadge
} = window.NikeRetailDesignSystem_5e7285;
const SIZES = ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"];
const SOLD_OUT = ["6", "11"];
function ProductDetail({
  go,
  onAddToBag
}) {
  const [color, setColor] = React.useState(0);
  const [size, setSize] = React.useState(null);
  const [angle, setAngle] = React.useState(0);
  const [added, setAdded] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-xl) var(--gutter-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-caption-md)",
      color: "var(--mute)",
      marginBottom: "var(--space-lg)"
    }
  }, "Men / Shoes / Trail Running"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "72px minmax(0,1fr) 400px",
      gap: "var(--space-xl)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-sm)"
    }
  }, [0, 1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    onClick: () => setAngle(i),
    style: {
      cursor: "pointer",
      outline: angle === i ? "1px solid var(--ink)" : "1px solid var(--hairline-soft)"
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    ratio: "1 / 1",
    label: `${i + 1}`
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    ratio: "1 / 1",
    label: `ACG Zegama — view ${angle + 1} of 6, staged on soft cloud`
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "var(--space-md)",
      left: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement(PromoBadge, null, "Sustainable Materials")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: "var(--space-md)",
      right: "var(--space-md)",
      display: "flex",
      gap: "var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-left",
    label: "Previous view",
    onClick: () => setAngle(a => (a + 5) % 6)
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-right",
    label: "Next view",
    onClick: () => setAngle(a => (a + 1) % 6)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: "var(--type-heading-xl)",
      color: "var(--ink)"
    }
  }, "ACG Zegama"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-caption-md)",
      color: "var(--mute)",
      marginTop: "var(--space-sm)"
    }
  }, "Men's Trail Running Shoes")), /*#__PURE__*/React.createElement(PriceRow, {
    price: "$185"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-caption-sm)",
      color: "var(--mute)"
    }
  }, "Select Colour"), /*#__PURE__*/React.createElement(SwatchDots, {
    colors: ["#111111", "#f5f5f5", "#0a7281", "#ffb0dd"],
    activeIndex: color,
    onSelect: setColor,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      font: "var(--type-caption-sm)",
      color: "var(--mute)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Select Size"), /*#__PURE__*/React.createElement("span", {
    style: {
      textDecoration: "underline",
      color: "var(--ink)"
    }
  }, "Size Guide")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-sm)"
    }
  }, SIZES.map(s => {
    const out = SOLD_OUT.includes(s);
    const on = size === s;
    return /*#__PURE__*/React.createElement("button", {
      key: s,
      type: "button",
      disabled: out,
      onClick: () => setSize(s),
      style: {
        height: 48,
        font: "var(--type-button-md)",
        background: "var(--canvas)",
        color: out ? "var(--stone)" : "var(--ink)",
        border: `1px solid ${on ? "var(--ink)" : "var(--hairline)"}`,
        borderRadius: "var(--radius-lg)",
        cursor: out ? "default" : "pointer",
        textDecoration: out ? "line-through" : "none"
      }
    }, "UK ", s);
  }))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    full: true,
    onClick: () => {
      setAdded(true);
      onAddToBag && onAddToBag();
    }
  }, added ? "Added to Bag" : "Add to Bag"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    full: true
  }, "Favourite"), added && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-caption-md)",
      color: "var(--success)"
    }
  }, "In your bag \xB7 free delivery for members"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body-md)",
      color: "var(--charcoal)"
    }
  }, "Built for steep, loose and technical ground. A rock plate underfoot and aggressive lugs keep you steady when the trail turns."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DisclosureRow, {
    label: "View Product Details",
    defaultOpen: true
  }, "Padded collar, breathable mesh upper, and a full-length foam midsole. Style: DH0623-001."), /*#__PURE__*/React.createElement(DisclosureRow, {
    label: "Shipping & Returns"
  }, "Free standard shipping and 30-day returns for members."), /*#__PURE__*/React.createElement(DisclosureRow, {
    label: "Reviews (128)"
  }, "4.6 out of 5 stars.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--rhythm-section)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 var(--space-lg)",
      font: "var(--type-heading-xl)"
    }
  }, "You Might Also Like"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "var(--gap-grid)"
    }
  }, ["Wildhorse 8", "Kiger 10", "Ultrafly", "Juniper Trail 3"].map(n => /*#__PURE__*/React.createElement(ProductCard, {
    key: n,
    name: n,
    category: "Men's Trail Running Shoes",
    price: "$140",
    colors: ["#111111", "#f5f5f5"],
    imageLabel: `${n} product photography`,
    onClick: () => go("pdp")
  })))));
}
Object.assign(window, {
  ProductDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/retail-web/ProductDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/retail-web/Shell.jsx
try { (() => {
const {
  UtilityBar,
  PrimaryNav,
  SiteFooter
} = window.NikeRetailDesignSystem_5e7285;
function Container({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--gutter-page)",
      ...style
    }
  }, children);
}
function SectionHead({
  title,
  action,
  onAction
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-xl)",
      marginBottom: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: "var(--type-heading-xl)",
      color: "var(--ink)"
    }
  }, title), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      font: "var(--type-link-md)",
      color: "var(--ink)",
      background: "none",
      border: "none",
      textDecoration: "underline",
      cursor: "pointer"
    }
  }, action));
}
function Shell({
  screen,
  go,
  bagCount,
  children
}) {
  const sectionFor = {
    home: "Men",
    listing: "Men",
    pdp: "Men",
    membership: "New & Featured"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-page)",
      minHeight: "100%"
    }
  }, /*#__PURE__*/React.createElement(UtilityBar, {
    onLink: l => l === "Join Us" && go("membership")
  }), /*#__PURE__*/React.createElement(PrimaryNav, {
    active: sectionFor[screen],
    items: ["New & Featured", "Men", "Women", "Kids", "Jordan", "Sport"],
    onSelect: l => go(l === "Men" ? "home" : "listing"),
    onLogo: () => go("home"),
    bagCount: bagCount
  }), children, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--rhythm-section)"
    }
  }, /*#__PURE__*/React.createElement(SiteFooter, null)));
}
Object.assign(window, {
  Container,
  SectionHead,
  Shell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/retail-web/Shell.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.FilterChip = __ds_scope.FilterChip;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.CampaignTile = __ds_scope.CampaignTile;

__ds_ns.CategoryIconCard = __ds_scope.CategoryIconCard;

__ds_ns.DisclosureRow = __ds_scope.DisclosureRow;

__ds_ns.MemberBenefitCard = __ds_scope.MemberBenefitCard;

__ds_ns.SearchPill = __ds_scope.SearchPill;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Photo = __ds_scope.Photo;

__ds_ns.FilterSidebar = __ds_scope.FilterSidebar;

__ds_ns.PrimaryNav = __ds_scope.PrimaryNav;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SubNav = __ds_scope.SubNav;

__ds_ns.UtilityBar = __ds_scope.UtilityBar;

__ds_ns.PriceRow = __ds_scope.PriceRow;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.PromoBadge = __ds_scope.PromoBadge;

__ds_ns.SwatchDots = __ds_scope.SwatchDots;

})();
