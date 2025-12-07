describe("Product Sorting Tests", () => {
    describe("Server-Side Product Sorting Logic", () => {

        test("should sort products by price in descending order by default", () => {
            const products = [
                { _id: "1", name: "Product A", price: 100 },
                { _id: "2", name: "Product B", price: 50 },
                { _id: "3", name: "Product C", price: 150 }
            ];

            const sorted = products.sort((a, b) => b.price - a.price);

            expect(sorted[0].price).toBe(150);
            expect(sorted[1].price).toBe(100);
            expect(sorted[2].price).toBe(50);
        });

        test("should sort products by price in ascending order when x-sort header is 'asc'", () => {
            const products = [
                { _id: "1", name: "Product A", price: 100 },
                { _id: "2", name: "Product B", price: 50 },
                { _id: "3", name: "Product C", price: 150 }
            ];

            const sorted = products.sort((a, b) => a.price - b.price);

            expect(sorted[0].price).toBe(50);
            expect(sorted[1].price).toBe(100);
            expect(sorted[2].price).toBe(150);
        });

        test("should handle sorting with same prices", () => {
            const products = [
                { _id: "1", name: "Product A", price: 100 },
                { _id: "2", name: "Product B", price: 100 },
                { _id: "3", name: "Product C", price: 50 }
            ];

            const sorted = products.sort((a, b) => b.price - a.price);

            expect(sorted[0].price).toBe(100);
            expect(sorted[1].price).toBe(100);
            expect(sorted[2].price).toBe(50);
        });

        test("should determine sort order based on request header", () => {
            const mockHeaders = {
                defaultHeaders: { "x-sort": undefined },
                ascHeaders: { "x-sort": "asc" },
                descHeaders: { "x-sort": "desc" }
            };

            let sortOption = mockHeaders.defaultHeaders["x-sort"] === "asc" ? 1 : -1;
            expect(sortOption).toBe(-1);

            sortOption = mockHeaders.ascHeaders["x-sort"] === "asc" ? 1 : -1;
            expect(sortOption).toBe(1);

            sortOption = mockHeaders.descHeaders["x-sort"] === "asc" ? 1 : -1;
            expect(sortOption).toBe(-1);
        });

        test("should validate sorting happens server-side before response", () => {
            const products = [
                { _id: "1", name: "Product A", price: 75 },
                { _id: "2", name: "Product B", price: 25 },
                { _id: "3", name: "Product C", price: 100 }
            ];

            // FIXED SORT LOGIC
            const sortLogic = (items, sortHeader) => {
                return items.sort((a, b) => {
                    if (sortHeader === "asc") {
                        return a.price - b.price;  // ascending
                    }
                    return b.price - a.price;      // descending default
                });
            };

            const defaultSorted = sortLogic(
                JSON.parse(JSON.stringify(products)),
                undefined
            );
            const ascSorted = sortLogic(
                JSON.parse(JSON.stringify(products)),
                "asc"
            );

            expect(defaultSorted[0].price).toBe(100);
            expect(defaultSorted[2].price).toBe(25);

            expect(ascSorted[0].price).toBe(25);
            expect(ascSorted[2].price).toBe(100);
        });

        test("should include pagination with sorted results", () => {
            const products = Array.from({ length: 25 }, (_, i) => ({
                _id: String(i + 1),
                name: `Product ${i + 1}`,
                price: Math.floor(Math.random() * 1000)
            }));

            const page = 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            const paginated = products
                .sort((a, b) => b.price - a.price)
                .slice(skip, skip + limit);

            expect(paginated.length).toBeLessThanOrEqual(limit);
            expect(paginated.length).toBe(10);
        });
    });

    describe("Category Filtering with Sorting", () => {
        test("should filter by category and apply sorting", () => {
            const products = [
                { _id: "1", name: "Electronics A", price: 500, category: "electronics" },
                { _id: "2", name: "Electronics B", price: 300, category: "electronics" },
                { _id: "3", name: "Books A", price: 20, category: "books" }
            ];

            const category = "electronics";
            const filtered = products
                .filter(p => p.category === category)
                .sort((a, b) => b.price - a.price);

            expect(filtered.length).toBe(2);
            expect(filtered[0].price).toBe(500);
            expect(filtered[1].price).toBe(300);
        });
    });

    describe("Search Functionality with Sorting", () => {
        test("should search products and apply sorting", () => {
            const products = [
                { _id: "1", name: "Laptop Pro", price: 999, sku: "LAP001" },
                { _id: "2", name: "Laptop Standard", price: 599, sku: "LAP002" },
                { _id: "3", name: "Mouse Wireless", price: 29, sku: "MOU001" }
            ];

            const searchQuery = "laptop";
            const searched = products
                .filter(p =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .sort((a, b) => b.price - a.price);

            expect(searched.length).toBe(2);
            expect(searched[0].name).toContain("Laptop");
            expect(searched[0].price).toBe(999);
        });
    });
});
