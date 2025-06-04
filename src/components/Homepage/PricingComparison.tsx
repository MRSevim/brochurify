const PricingComparison = () => {
  return (
    <div className="max-w-4xl mx-auto my-12 border rounded-lg overflow-hidden text-sm">
      <div className="grid grid-cols-3 bg-muted font-medium text-center">
        <div className="p-4 text-left">Feature</div>
        <div className="p-4 text-xl">Free (Requires account)</div>
        <div className="p-4 text-xl">Subscription</div>
      </div>

      <div className="grid grid-cols-3 border-t text-center">
        <div className="p-4 text-left">Projects</div>
        <div className="p-4">Up to 3</div>
        <div className="p-4">Up to 10</div>

        <div className="border-t p-4 text-left">Custom Domains</div>
        <div className="border-t p-4">
          Not available
          <br />
          <span className="text-xs text-muted-foreground">
            Uses .brochurify.net
          </span>
        </div>
        <div className="border-t p-4">Available</div>

        <div className="border-t p-4 text-left">Image Uploads</div>
        <div className="border-t p-4">Not available</div>
        <div className="border-t p-4">
          Up to 50 images
          <br />
          <span className="text-xs text-muted-foreground">Max 5MB each</span>
        </div>
      </div>
    </div>
  );
};

export default PricingComparison;
