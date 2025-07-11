import { appConfig } from "@/utils/config";

const PricingComparison = () => {
  return (
    <>
      <div
        className="max-w-4xl mx-auto my-12 mb-0 border rounded-lg overflow-hidden text-sm break-words"
        id="pricing"
      >
        <div className="grid grid-cols-3 bg-muted font-medium text-center items-center">
          <div className="p-4 text-left">Feature</div>
          <div className="p-4 md:text-xl ">Free (Requires account)</div>
          <div className="p-4 md:text-xl ">
            Subscription ({appConfig.MONTHLY_SUB_PRICE}$/month)
          </div>
        </div>

        <div className="grid grid-cols-3 border-t text-center">
          <div className="p-4 text-left">
            Projects <span className="text-red-600">*</span>
          </div>
          <div className="p-4">Up to {appConfig.FREE_ACC_PROJECT_LIMIT}</div>
          <div className="p-4">Up to {appConfig.SUB_ACC_PROJECT_LIMIT}</div>

          <div className="border-t p-4 text-left">Custom Domains</div>
          <div className="border-t p-4">
            Not available
            <br />
            <span className="text-xs text-muted-foreground">
              Uses {appConfig.DOMAIN_EXTENSION}
            </span>
          </div>
          <div className="border-t p-4">Available</div>

          <div className="border-t p-4 text-left">Image Uploads</div>
          <div className="border-t p-4">Not available</div>
          <div className="border-t p-4">
            Up to {appConfig.MAX_IMAGE_COUNT} images
            <br />
            <span className="text-xs text-muted-foreground">
              Max {appConfig.MAX_IMAGE_SIZE_MB}MB each
            </span>
          </div>
        </div>
      </div>
      {/* Disclaimer */}
      <div className="mt-4 px-4 text-xs text-muted-foreground italic max-w-4xl mx-auto">
        * A single project can have maximum {appConfig.MAX_PROJECT_SIZE_KB}KB
        data in it. This is a hard limit to reach but has to be there to prevent
        abuse.
      </div>
    </>
  );
};

export default PricingComparison;
