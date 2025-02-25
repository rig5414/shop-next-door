import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { ShopStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { ShopType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admins
  const admins = await prisma.user.createMany({
    data: [
      { name: "Peter Njoroge", email: "peternjor5@gmail.com", password: "admin123", role: "admin" },
      { name: "Grace Otieno", email: "otienograce@gmail.com", password: "admin123", role: "admin" },
      { name: "John Mwangi", email: "mwjohn980@gmail.com", password: "admin123", role: "admin" },
    ],
  });

  // Vendors
  const vendors = await prisma.user.createMany({
    data: [
      { name: "James Kamau", email: "james@gmail.com", password: "vendor123", role: "vendor" },
      { name: "Alice Wanjiru", email: "wanjirualice@gmail.com", password: "vendor123", role: "vendor" },
      { name: "David Mutua", email: "davidm@gmail.com", password: "vendor123", role: "vendor" },
      { name: "Paul Kibet", email: "kipaul001@gmail.com", password: "vendor123", role: "vendor" },
      { name: "Naomi Cheruiyot", email: "naomiche89@gmail.com", password: "vendor123", role: "vendor" },
    ],
  });

  // Customers
  const customers = await prisma.user.createMany({
    data:  [
      { name: "Wanjiru Njuguna", email: "wanjirunjuguna@gmail.com", password: "customer123", role: "customer" },
      { name: "Omondi Onyango", email: "omondionyango78@gmail.com", password: "customer123", role: "customer" },
      { name: "Njeri Kibaru", email: "njerikibaru1995@gmail.com", password: "customer123", role: "customer" },
      { name: "Kiprotich Koech", email: "kkoech@gmail.com", password: "customer123", role: "customer" },
      { name: "Akinyi Aketch", email: "akinyiaketch@gmail.com", password: "customer123", role: "customer" },
      { name: "Anne Nduku", email: "annenduku22@gmail.com", password: "customer123", role: "customer" },
      { name: "Rono Kevin", email: "krono@gmail.com", password: "customer123", role: "customer" },
      { name: "Wambui Githinji", email: "wambuigithinji@gmail.com", password: "customer123", role: "customer" },
      { name: "Barasa Wekesa", email: "bwekesa@gmail.com", password: "customer123", role: "customer" },
      { name: "Zawadi Kazungu", email: "zkazungu90@gmail.com", password: "customer123", role: "customer" }
    ],
  });

 // Shops
const shopData = [
    { name: "Kamau's Mini Mart", description: "A local convenience store.", type: ShopType.local_shop, status: ShopStatus.active, vendorId: "1" },
    { name: "Alice's Superstore", description: "Affordable household goods.",type: ShopType.local_shop, status: ShopStatus.active, vendorId: "2" },
    { name: "Mutua Retail Shop", description: "Reliable everyday products.",type: ShopType.local_shop, status: ShopStatus.active, vendorId: "3" },
    { name: "Paul's Grocery", description: "Fresh farm produce.",type: ShopType.grocery_shop, status: ShopStatus.active, vendorId: "4" },
    { name: "Naomi's Fresh Groceries", description: "Quality fruits and vegetables.",type: ShopType.grocery_shop, status: ShopStatus.active, vendorId: "5" },
  ];
  
  const shops = await prisma.shop.createMany({ data: shopData });

// Products
const localProducts = [
    { name: "Pembe Maize Flour", description: "Fortified maize meal.", price: new Prisma.Decimal(150), stock: 100, image: "maizeflour.jpg" },
    { name: "Kabras Sugar", description: "Brown sugar.", price: new Prisma.Decimal(240), stock: 80, image: "sugar.jpg" },
    { name: "Fresh fri", description: "Cooking Oil.", price: new Prisma.Decimal(240), stock: 50, image: "cookingoil.jpg" },
    { name: "Bar Soap", description: "Sunlight panga soap.", price: new Prisma.Decimal(40), stock: 200, image: "barsoap.jpg" },
    { name: "Closeup Toothpaste", description: "Oral hygiene essential.", price: new Prisma.Decimal(120), stock: 100, image: "toothpaste.jpg" },
    { name: "Ajab Wheat Flour", description: "Home baking flour.", price: new Prisma.Decimal(180), stock: 90, image: "wheatflour.jpg" },
    { name: "Kensalt", description: "Essential seasoning.", price: new Prisma.Decimal(20), stock: 250, image: "salt.jpg" },
    { name: "Mwea Pishori", description: "Long grain rice.", price: new Prisma.Decimal(220), stock: 120, image: "rice.jpg" },
    { name: "Blue Band", description: "Blueband oiginal.", price: new Prisma.Decimal(130), stock: 70, image: "blueband.jpg" },
    { name: "Ariel Detergent", description: "Laundry detergent.", price: new Prisma.Decimal(210), stock: 110, image: "detergent.jpg" },
    { name: "Biscuits", description: "Assorted biscuits.", price: new Prisma.Decimal(100), stock: 150, image: "biscuit.jpg" },
    { name: "Dormans Coffee", description: "Instant coffee.", price: new Prisma.Decimal(120), stock: 60, image: "coffee.jpg" },
    { name: "Ketepa Tea", description: "Tea leaves.", price: new Prisma.Decimal(60), stock: 85, image: "tealeaves.jpg" },
    { name: "Kifaru Matches", description: "Lighting match.", price: new Prisma.Decimal(5), stock: 300, image: "matchbox.jpg" },
    { name: "Candles", description: "For lighting.", price: new Prisma.Decimal(10), stock: 180, image: "candle.jpg" },
    { name: "Batteries", description: "AA batteries.", price: new Prisma.Decimal(140), stock: 100, image: "battery.jpg" },
    { name: "Light Bulb", description: "Energy saving bulb.", price: new Prisma.Decimal(60), stock: 120, image: "bulb.jpg" },
    { name: "Mosquito Coil", description: "Insect repellent.", price: new Prisma.Decimal(10), stock: 200, image: "mosquitocoil.jpg" },
    { name: "Rosy Toilet Roll", description: "Bathroom tissue.", price: new Prisma.Decimal(40), stock: 160, image: "toiletpaper.jpg" },
    { name: "Morning Fresh", description: "Dishwashing liquid.", price: new Prisma.Decimal(110), stock: 140, image: "dishsoap.jpg" },
    { name: "Body Lotion", description: "Nivea body lotion.", price: new Prisma.Decimal(220), stock: 90, image: "bodylotion.jpg" },
    { name: "Long life Milk", description: "Brookside milk.", price: new Prisma.Decimal(60), stock: 130, image: "brookside.jpg" },
    { name: "Raha Drinking Chocolate", description: "Hot chocolate mix.", price: new Prisma.Decimal(80), stock: 110, image: "drinkingchocolate.jpg" },
    { name: "Eggs", description: "A dozen eggs.", price: new Prisma.Decimal(390), stock: 150, image: "eggs.jpg" },
    { name: "Gillette Razor", description: "Disposable razor.", price: new Prisma.Decimal(65), stock: 180, image: "gillette.jpg" },
    { name: "Pampers", description: "Baby diapers.", price: new Prisma.Decimal(65), stock: 70, image: "diapers.jpg" },
    { name: "Always pads", description: "Sanitary pads.", price: new Prisma.Decimal(70), stock: 120, image: "pads.jpg" },
    { name: "Hollander Yoghurt", description: "Flavored yoghurt.", price: new Prisma.Decimal(130), stock: 140, image: "yoghurt.jpg" },
    { name: "Cplgate Toothbrush", description: "Manual toothbrush.", price: new Prisma.Decimal(70), stock: 200, image: "toothbrush.jpg" },
    { name: "Teepee Toothpick", description: "Wooden toothpicks.", price: new Prisma.Decimal(40), stock: 250, image: "toothpick.jpg" },
    { name: "Royco Cubes", description: "Flavoring cubes.", price: new Prisma.Decimal(40), stock: 180, image: "roycocubes.jpg" },
    { name: "Soy Sauce", description: "Condiment.", price: new Prisma.Decimal(110), stock: 100, image: "soysauce.jpg" },
    { name: "Spaghetti", description: "Pasta.", price: new Prisma.Decimal(120), stock: 160, image: "spaghetti.jpg" },
    { name: "Coca Cola Soda", description: "Soft drink.", price: new Prisma.Decimal(170), stock: 200, image: "soda.jpg" },
    { name: "Peptang Tomato Sauce", description: "Ketchup.", price: new Prisma.Decimal(80), stock: 110, image: "tomatosauce.jpg" },
    { name: "Savannah Juice", description: "Fruit juice.", price: new Prisma.Decimal(150), stock: 130, image: "juice.jpg" },
    { name: "Dasani Water", description: "Bottled water.", price: new Prisma.Decimal(40), stock: 220, image: "dasani.jpg" },
    { name: "Harpic Bleach", description: "Household bleach.", price: new Prisma.Decimal(110), stock: 170, image: "jik.jpg" },
    { name: "Cadboury Chocolate", description: "Chocolate bar.", price: new Prisma.Decimal(210), stock: 190, image: "chocolate.jpg" },
  ];
  
  const groceryProducts = [
      { name: "Tomatoes", description: "Fresh tomatoes.", price: new Prisma.Decimal(80), stock: 200, image: "tomato.jpg" },
      { name: "Onions", description: "Red onions.", price: new Prisma.Decimal(90), stock: 150, image: "onion.jpg" },
      { name: "Cabbage", description: "Green cabbage.", price: new Prisma.Decimal(40), stock: 100, image: "cabbage.jpg" },
      { name: "Carrots", description: "Orange carrots.", price: new Prisma.Decimal(10), stock: 120, image: "carrot.jpg" },
      { name: "Potatoes", description: "White potatoes.", price: new Prisma.Decimal(150), stock: 180, image: "potatoes.jpg" },
      { name: "Spinach", description: "Fresh spinach.", price: new Prisma.Decimal(30), stock: 150, image: "spinach.jpg" },
      { name: "Mangoes", description: "Ripe mangoes.", price: new Prisma.Decimal(5), stock: 120, image: "mangoes.jpg" },
      { name: "Lemons", description: "Fresh lemons.", price: new Prisma.Decimal(5), stock: 120,  image: "lemons.jpg" },
      { name: "Apples", description: "Fresh apples.", price: new Prisma.Decimal(30), stock: 98, image: "apples.jpg" },
      { name: "Avocados", description: "Fresh avocados.", price: new Prisma.Decimal(10), stock: 65, image: "avocado.jpg" },
      { name: "Chilli pepper", description: "Green chillis.", price: new Prisma.Decimal(1), stock: 200, image: "chillipepper.jpg" },
      { name: "Ginger", description: "Fresh ginger.", price: new Prisma.Decimal(20), stock: 200, image: "ginger.jpg" },
      { name: "Pilipili hoho", description: "Fresh hohos.", price: new Prisma.Decimal(5), stock: 200, image: "hoho.jpg" },
      { name: "Kales", description: "Fresh sukuma wiki.", price: new Prisma.Decimal(30), stock: 200, image: "kales.jpg" },
  ];

  // Assign products to shops
  for (let shopId = 1; shopId <= 3; shopId++) {
    for (let product of localProducts) {
      await prisma.product.create({
        data: { ...product, shopId: shopId.toString() },
      });
    }
  }

  for (let shopId = 4; shopId <= 5; shopId++) {
    for (let product of groceryProducts) {
      await prisma.product.create({
        data: { ...product, shopId: shopId.toString() },
      });
    }
  }

  // Generate Random Orders
  const products = await prisma.product.findMany();
  const createdShops = await prisma.shop.findMany();

  for (let i = 0; i < 20; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const shop = faker.helpers.arrayElement(createdShops);
    const orderProducts = faker.helpers.arrayElements(products, { min: 1, max: 5 });

    const total = orderProducts.reduce((sum, p) => sum + p.price.toNumber(), 0);
    const orderStatus = faker.helpers.arrayElement(["pending", "shipped", "completed", "cancelled"]);

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        shopId: shop.id,
        total,
        status: orderStatus,
        items: {
          create: orderProducts.map((p) => ({
            productId: p.id,
            quantity: faker.number.int({ min: 1, max: 5 }),
            price: p.price,
          })),
        },
      },
    });

    await prisma.transaction.create({
      data: {
        orderId: order.id,
        customerId: customer.id,
        amount: total,
        status: faker.helpers.arrayElement(["pending", "successful", "failed"]),
      },
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
