import { useEffect, useState } from "react";
import { Card } from "../lib/types";
import Modal from "../components/Modal";
import CardItem from "../components/CardItem";
import { invoke } from "@tauri-apps/api";

const Cards = () => {
  const [cards, setCards] = useState<Card[]>();
  const [cardName, setCardName] = useState("");
  const [error, setError] = useState("");
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    const cards: Card[] = await invoke<Card[]>("select_all_cards");
    setCards(cards);
  };

  const createCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await invoke("add_card", { name: cardName }).catch((e) => {
      setError("Coleção já existe!");
    });

    loadCards();
    setShouldShow(false);
  };

  return (
    <section className="w-full bg-zinc-900 p-10">
      <div className="py-2 border-b border-b-zinc-800">
        <div className="flex justify-between w-full items-center">
          <h3 className="text-zinc-100 font-black text-2xl">
            Repetição espaçada
          </h3>

          <button
            onClick={() => setShouldShow(true)}
            className="py-1 px-3 bg-white text-titleBar-600 rounded-md text-sm font-medium hover:bg-zinc-900 hover:text-zinc-100 border border-zinc-100 hover:border-zinc-800"
          >
            Nova coleção
          </button>
        </div>
        <p className="text-xs text-zinc-300 py-2">
          Selecione um cartão de repetição espaçada para começar seus estudos
        </p>
      </div>

      <div className="my-10 grid grid-cols-5 gap-6">
        {cards?.map((card) => (
          <CardItem card={card} />
        ))}
      </div>

      <Modal
        title="Criar coleção"
        shouldShow={shouldShow}
        onClose={() => setShouldShow(false)}
      >
        <div className="px-4 py-4 flex flex-col gap-4">
          <p className="text-xs">Nome da coleção</p>
          <form className="flex flex-col gap-4" onSubmit={createCard}>
            <div className="relative">
              <input
                type="text"
                autoFocus={true}
                placeholder="Título da anotação"
                className="w-full p-1.5 rounded-md bg-zinc-900 border border-zinc-800 focus:border-zinc-700 focus:outline-none text-xs text-zinc-100"
                id="input"
                autoComplete="off"
                onChange={(e) => setCardName(e.currentTarget.value)}
              />

              {error.length > 0 && (
                <p className="text-xs text-red-600 px-2 bg-zinc-900 absolute -top-1.5 right-4">
                  {error}
                </p>
              )}
            </div>

            <button className="px-4 py-1.5 text-xs text-zinc-900 bg-zinc-100 rounded-md font-medium hover:bg-zinc-900 hover:text-zinc-100 border border-zinc-100 hover:border-zinc-800 z-50">
              Criar cartão
            </button>
          </form>
        </div>
      </Modal>
    </section>
  );
};

export default Cards;
