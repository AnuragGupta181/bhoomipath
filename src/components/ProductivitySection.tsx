const ProductivitySection = () => {
  const features = [
    "Scale through uploading supplier lists, product lists, or Bills of Materials",
    "Versatility through parameter-based LCA, to do LCAs of whole product lines",
    "Collaborative models that measure your product's whole life cycle (supply chain, manufacturing, logistics, usage, end of life, ...)",
    "Access to reputed LCA databases and methods",
    "Compare your products with industry benchmarks, each other, or even competitors",
    "Faster third-party verification inside the app"
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <p className="text-primary text-sm font-semibold tracking-wider uppercase">
                FEATURES
              </p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                BOOST YOUR PRODUCTIVITY{" "}
                <span className="earthster-text-gradient">WITH EARTHSTER</span>
              </h2>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-4 animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-foreground text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visualization */}
          <div className="relative animate-scale-in">
            <div className="earthster-card rounded-2xl p-8 relative overflow-hidden">
              {/* Mock interface elements */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">← Back</span>
                  <span className="text-primary font-semibold">earthster</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <span className="text-sm">Cardboard box</span>
                  </div>
                  
                  <div className="bg-border h-px w-full"></div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Climate change</span>
                    <div className="w-16 h-6 bg-primary/20 rounded"></div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-border px-2 py-1 rounded">5%</span>
                    <div className="w-4 h-4 bg-muted rounded-full"></div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="text-xs text-muted-foreground mb-2">All Others</div>
                  <div className="relative">
                    <div className="w-full h-32 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20"></div>
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 bg-primary rounded-full"></div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="text-xs">
                        <div>Production</div>
                        <div className="text-muted-foreground">Edit ✏️</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductivitySection;