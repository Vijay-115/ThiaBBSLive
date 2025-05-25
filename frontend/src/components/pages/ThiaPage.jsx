import ThiaHeroVideo from "../home/ThiaHeroVideo";
import ThiaBestSelling from "../home/ThiaBestSelling";
import AnimationCards from "../home/AnimationCards";
import OfferSection from "../home/OfferSection";

const ThiaPage = () => {
    return (
        <>
            <ThiaHeroVideo />
            <section className="container py-10 bg-slate-100">
                <h2 className="text-2xl  text-center mb-6 font-serif">
                    BEST SELLING JEWELLERY
                </h2>
                <ThiaBestSelling />
            </section>
            <div className="container">
                <AnimationCards />
                <OfferSection />
            </div>
        </>
    );
};

export default ThiaPage;