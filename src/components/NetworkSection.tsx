import earthHero from "@/assets/earth-hero.jpg";
import networkBg from "@/assets/network-bg.jpg";

const NetworkSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={networkBg} 
          alt="Network visualization" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Cost Reduction Highlight */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 mb-8">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Bring the cost per LCA <span className="earthster-text-gradient">down to 10£/LCA</span>
            </h2>
            <p className="text-muted-foreground text-sm">
              *based on customer case study, exact amount may vary
            </p>
          </div>
        </div>

        {/* Network Visualization */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <div className="relative h-96 flex items-center justify-center">
            {/* Earth in center */}
            <div className="relative z-10">
              <div className="relative">
                <img 
                  src={earthHero} 
                  alt="Earth from space - environmental sustainability focus" 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover animate-pulse-glow border-4 border-avocado/30 shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-transparent to-avocado/20"></div>
              </div>
            </div>

            {/* Network Nodes */}
            <div className="absolute top-8 left-8 w-12 h-12 earthster-network-node animate-float"></div>
            <div className="absolute top-16 right-12 w-8 h-8 earthster-network-node animate-float" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-20 left-16 w-16 h-16 earthster-network-node animate-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-8 right-8 w-6 h-6 earthster-network-node animate-float" style={{animationDelay: '1.5s'}}></div>

            {/* Connection Lines */}
            <div className="absolute top-14 left-20 w-32 h-px earthster-network-line transform rotate-45"></div>
            <div className="absolute top-22 right-20 w-24 h-px earthster-network-line transform -rotate-45"></div>
            <div className="absolute bottom-32 left-32 w-40 h-px earthster-network-line transform rotate-12"></div>
          </div>
        </div>

        {/* Description Text */}
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <p className="text-lg md:text-xl text-primary mb-6 font-semibold">
            With Earthster's approach to scale you can have LCA results for all your 
            products in the time it takes you to do one LCA in other software.
          </p>
          <p className="text-muted-foreground">
            And all in a celebrated UX that helps users answer important questions, 
            regardless of their background.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NetworkSection;