import { render, screen, fireEvent } from "@testing-library/react";
import { CardDetailsModal } from "../src/components/CardDetailsModal";

const mockCard = {
  id: "xy7-54",
  name: "Pikachu",
  hp: "60",
  supertype: "Pokémon",
  subtypes: ["Basic"],
  types: ["Lightning"],
  evolvesFrom: "Pichu",
  images: {
    small: "https://example.com/pikachu-small.png",
    large: "https://example.com/pikachu.png",
  },
  abilities: [
    {
      name: "Static",
      type: "Ability",
      text: "Whenever your opponent touches Pikachu, they get shocked.",
    },
  ],
  attacks: [
    {
      name: "Thunderbolt",
      damage: "90",
      cost: ["Lightning", "Colorless"],
      text: "Discard all Energy from this Pokémon.",
      convertedEnergyCost: 2, // ✅ required
    },
  ],
  weaknesses: [{ type: "Fighting", value: "×2" }],
  resistances: [{ type: "Metal", value: "-20" }],
  retreatCost: ["Colorless"],
  set: {
    id: "base1",
    name: "Base Set",
    series: "Original",
    printedTotal: 102,
    total: 102,
    releaseDate: "1999-01-09",
    images: {
      symbol: "https://example.com/symbol.png",
      logo: "https://example.com/logo.png",
    },
  },
  number: "25",
  rarity: "Common",
  artist: "Ken Sugimori",
  flavorText: "A friendly electric mouse Pokémon.",
  tcgplayer: {
    url: "https://example.com/pikachu-card", // ✅ required
    updatedAt: "2024-10-18", // ✅ required
    prices: {
      normal: { low: 1.5, mid: 3.0, high: 5.0, market: 2.5 },
    },
  },
};

describe("CardDetailsModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <CardDetailsModal card={mockCard} isOpen={false} onClose={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders card details when open", () => {
    render(<CardDetailsModal card={mockCard} isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText(/HP:/)).toBeInTheDocument();
    expect(screen.getAllByText("Lightning").length).toBeGreaterThan(0); // ✅ handles duplicates
    expect(screen.getByText(/Base Set/)).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(<CardDetailsModal card={mockCard} isOpen={true} onClose={onClose} />);

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
