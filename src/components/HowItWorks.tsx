const HowItWorks = () => {
  return (
    <section className="py-20 bg-card/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 heading-wonderbar">
            <span className="earthster-text-gradient">HOW IT WORKS</span>
          </h2>
        </div>

        {/* Three Interface Screenshots */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[1, 2, 3].map((step, index) => (
            <div 
              key={step}
              className="animate-fade-in earthster-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              {/* Mock Interface */}
              <div className="bg-background/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-muted-foreground">earthster</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="h-2 bg-muted rounded w-3/4"></div>
                  <div className="h-2 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-primary/20 rounded"></div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-1 bg-muted rounded"></div>
                      <div className="h-1 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Step {step}</h3>
                <p className="text-muted-foreground text-sm">
                  {step === 1 && "Input your product data and specifications"}
                  {step === 2 && "AI processes and calculates environmental impact"}
                  {step === 3 && "Get comprehensive LCA results and insights"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in">
          <button className="earthster-btn-glow px-8 py-4 rounded-full text-lg font-semibold">
            START USING EARTHSTER TODAY!
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;