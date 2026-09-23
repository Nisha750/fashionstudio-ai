# Repair and complete the dress shopping experience

## What will change
- Make the Dresses collection load reliably instead of depending on fragile direct browser requests.
- Ensure every dress card always shows its assigned photograph, name, current price, rating, available sizes, and an always-visible Add to Bag action.
- Keep all dress styles distinct and preserve their individual product pages.
- Add clear loading, unavailable, and retry states so the page never appears blank.
- Check account creation and Google sign-in while validating the customer flow.

## Validation
- Open the Dresses collection on desktop and mobile widths.
- Confirm every listed dress has a loaded image, price, size choices, and working Add to Bag.
- Open multiple dress detail pages and verify their images and selected sizes reach the bag.
- Test the create-account page and begin the Google sign-in flow on the real preview address.

## Technical details
- Move public catalogue reads behind server functions using the existing public-read database policy.
- Replace fragile image discovery with an explicit dress image catalogue and safe fallback behavior.
- Keep the existing monochrome VÉRA design and current database records.
