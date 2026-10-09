from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.profiles.models import UserProfile
from apps.sellers.models import SellerProfile, SellerVerification
from apps.categories.models import Category, CategoryAttribute
from apps.listings.models import Listing, ListingImage, ContactClickEvent
from apps.favorites.models import Favorite
from apps.messaging.models import Conversation, ConversationParticipant, Message
from apps.notifications.models import Notification
from apps.moderation.models import AuditLog, ListingReport
from apps.core.models import SiteSetting
from django.utils import timezone

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds database with categories, demo personas, and authentic Ethiopian marketplace listings'

    def handle(self, *args, **options):
        self.stdout.write("Starting youGO-mart data seeding...")

        # 1. Site Settings
        SiteSetting.objects.update_or_create(
            key="announcement_bar",
            defaults={
                "value": "Welcome to youGO-mart! Commission-Free Classifieds Across Ethiopia 🇪🇹 • Post Free Ads in Under 2 Minutes",
                "description": "Top announcement text banner"
            }
        )
        SiteSetting.objects.update_or_create(
            key="founder_name",
            defaults={"value": "Endegena Abebe", "description": "Marketplace Founder"}
        )

        # 2. Categories
        categories_data = [
            {
                "name": "Phones and Electronics",
                "slug": "phones-and-electronics",
                "icon": "Smartphone",
                "order": 1,
                "desc": "Smartphones, tablets, headphones, smartwatches, and gadgets",
                "subs": ["Smartphones", "Tablets & iPads", "Headphones & Audio", "Smartwatches & Wearables"]
            },
            {
                "name": "Computers and Accessories",
                "slug": "computers-and-accessories",
                "icon": "Laptop",
                "order": 2,
                "desc": "Laptops, desktop PCs, PC parts, monitors, and networking",
                "subs": ["Laptops", "Desktop Computers", "Monitors & Screens", "Computer Accessories"]
            },
            {
                "name": "Fashion and Clothing",
                "slug": "fashion-and-clothing",
                "icon": "Shirt",
                "order": 3,
                "desc": "Men's & women's fashion, traditional Ethiopian clothing, shoes, and bags",
                "subs": ["Men's Fashion", "Women's Fashion", "Habesha Kemis & Traditional", "Shoes & Sneakers"]
            },
            {
                "name": "Jewelry and Accessories",
                "slug": "jewelry-and-accessories",
                "icon": "Sparkles",
                "order": 4,
                "desc": "Gold, silver, watches, rings, luxury sunglasses, and perfumes",
                "subs": ["Watches", "Gold & Silver Jewelry", "Sunglasses", "Bags & Wallets"]
            },
            {
                "name": "Home and Furniture",
                "slug": "home-and-furniture",
                "icon": "Home",
                "order": 5,
                "desc": "Living room sets, dining tables, beds, kitchen appliances, and decor",
                "subs": ["Sofas & Living Room", "Beds & Mattresses", "Kitchen Appliances", "Dining Sets"]
            },
            {
                "name": "Beauty and Personal Care",
                "slug": "beauty-and-personal-care",
                "icon": "HeartHandshake",
                "order": 6,
                "desc": "Perfumes, cosmetics, hair care, skincare, and grooming",
                "subs": ["Perfumes & Fragrances", "Skincare & Body", "Hair Care", "Makeup"]
            },
            {
                "name": "Sports and Hobbies",
                "slug": "sports-and-hobbies",
                "icon": "Bike",
                "order": 7,
                "desc": "Bicycles, gym equipment, sportswear, musical instruments, and gaming",
                "subs": ["Bicycles", "Gym & Fitness", "Sportswear", "Musical Instruments"]
            },
            {
                "name": "Vehicles",
                "slug": "vehicles",
                "icon": "Car",
                "order": 8,
                "desc": "Cars, SUVs, Bajaj, motorcycles, trucks, and spare parts in Ethiopia",
                "subs": ["Cars & SUVs", "Motorcycles & Bajaj", "Trucks & Commercial", "Auto Parts & Accessories"]
            },
            {
                "name": "Property",
                "slug": "property",
                "icon": "Building",
                "order": 9,
                "desc": "Apartments for rent, houses for sale, commercial shops, and land plots",
                "subs": ["Apartments for Rent", "Houses for Sale", "Commercial & Offices", "Land & Plots"]
            },
            {
                "name": "Other Products",
                "slug": "other-products",
                "icon": "ShoppingBag",
                "order": 10,
                "desc": "Books, baby items, construction tools, solar panels, and agriculture",
                "subs": ["Books & Stationery", "Baby & Kids", "Tools & Hardware", "Solar & Generators"]
            },
        ]

        cat_objs = {}
        for cdata in categories_data:
            cat, _ = Category.objects.update_or_create(
                slug=cdata["slug"],
                defaults={
                    "name": cdata["name"],
                    "icon_identifier": cdata["icon"],
                    "sort_order": cdata["order"],
                    "description": cdata["desc"],
                    "is_active": True,
                }
            )
            cat_objs[cdata["slug"]] = cat
            for sub_name in cdata["subs"]:
                sub_slug = f"{cdata['slug']}-{sub_name.lower().replace(' ', '-').replace('&', 'and')}"
                Category.objects.update_or_create(
                    slug=sub_slug,
                    defaults={
                        "name": sub_name,
                        "parent": cat,
                        "icon_identifier": cdata["icon"],
                        "sort_order": 0,
                        "is_active": True,
                    }
                )

        self.stdout.write(f"Categories seeded: {len(cat_objs)}")

        # 3. Demo Personas
        # Persona 1: Admin & Founder
        admin_user, _ = User.objects.update_or_create(
            email="endegena@yougomart.et",
            defaults={
                "username": "endegena",
                "phone": "+251911998877",
                "role": "admin",
                "is_staff": True,
                "is_superuser": True,
                "is_verified": True,
            }
        )
        admin_user.set_password("YouGoMart2026!")
        admin_user.save()
        UserProfile.objects.update_or_create(
            user=admin_user,
            defaults={
                "display_name": "Endegena Abebe (Founder)",
                "bio": "Founder of youGO-mart. Building Ethiopia's premier commission-free direct marketplace.",
                "city": "Addis Ababa",
                "region": "Addis Ababa"
            }
        )

        # Persona 2: Verified Seller Tigist Mengistu (Electronics)
        tigist_user, _ = User.objects.update_or_create(
            email="tigist@yougomart.et",
            defaults={
                "username": "tigist_gadgets",
                "phone": "+251911234567",
                "role": "verified_seller",
                "is_verified": True,
            }
        )
        tigist_user.set_password("Seller2026!")
        tigist_user.save()
        UserProfile.objects.update_or_create(
            user=tigist_user,
            defaults={
                "display_name": "Tigist Mengistu",
                "bio": "Certified electronics importer with 6 years experience in Bole, Addis Ababa.",
                "city": "Addis Ababa",
                "region": "Addis Ababa"
            }
        )
        tigist_seller, _ = SellerProfile.objects.update_or_create(
            user=tigist_user,
            defaults={
                "public_name": "Tigist Gadgets & Tech",
                "business_name": "Bole Modern Tech Store",
                "bio": "100% original smartphones, MacBooks, and audio gear. Pick up in Bole Edna Mall or meet in person. Inquiries welcome!",
                "contact_phone": "+251911234567",
                "allow_calls": True,
                "allow_whatsapp": True,
                "allow_messages": True,
                "allow_email": True,
                "location_city": "Addis Ababa",
                "location_neighborhood": "Bole",
                "verification_status": "verified",
                "total_views": 1420,
                "total_contact_clicks": 312,
                "response_time_str": "Replies in 15 mins",
                "verified_at": timezone.now()
            }
        )

        # Persona 3: Verified Seller Dawit Tadesse (Vehicles & Bikes)
        dawit_user, _ = User.objects.update_or_create(
            email="dawit@yougomart.et",
            defaults={
                "username": "dawit_motors",
                "phone": "+251922345678",
                "role": "verified_seller",
                "is_verified": True,
            }
        )
        dawit_user.set_password("Dawit2026!")
        dawit_user.save()
        UserProfile.objects.update_or_create(
            user=dawit_user,
            defaults={
                "display_name": "Dawit Tadesse",
                "bio": "Reliable car broker & dealership in Kazanchis, Addis Ababa.",
                "city": "Addis Ababa",
            }
        )
        dawit_seller, _ = SellerProfile.objects.update_or_create(
            user=dawit_user,
            defaults={
                "public_name": "Dawit Auto Exchange",
                "business_name": "Kazanchis Motors",
                "bio": "Clean Toyota, Hyundai, and European spec vehicles with authentic customs paperwork.",
                "contact_phone": "+251922345678",
                "allow_calls": True,
                "allow_whatsapp": True,
                "allow_messages": True,
                "location_city": "Addis Ababa",
                "location_neighborhood": "Kazanchis",
                "verification_status": "verified",
                "total_views": 2180,
                "total_contact_clicks": 418,
                "response_time_str": "Replies within 1 hour",
                "verified_at": timezone.now()
            }
        )

        # Persona 4: Selamawit Kebede (Fashion & Home)
        selam_user, _ = User.objects.update_or_create(
            email="selam@yougomart.et",
            defaults={
                "username": "selam_sheger",
                "phone": "+251933456789",
                "role": "seller",
                "is_verified": False,
            }
        )
        selam_user.set_password("Selam2026!")
        selam_user.save()
        UserProfile.objects.update_or_create(
            user=selam_user,
            defaults={
                "display_name": "Selamawit Kebede",
                "bio": "Habesha traditional artisan & modern home decorator in Piassa.",
                "city": "Addis Ababa",
            }
        )
        selam_seller, _ = SellerProfile.objects.update_or_create(
            user=selam_user,
            defaults={
                "public_name": "Sheger Habesha Designs",
                "business_name": "Selam Traditional Crafts",
                "bio": "Original handmade Ethiopian dresses, modern living room furniture, and home accessories.",
                "contact_phone": "+251933456789",
                "allow_calls": True,
                "allow_whatsapp": True,
                "allow_messages": True,
                "location_city": "Addis Ababa",
                "location_neighborhood": "Piassa",
                "verification_status": "pending",
                "total_views": 620,
                "total_contact_clicks": 85,
                "response_time_str": "Replies in 2 hours",
            }
        )

        # Persona 5: Buyer Abebe Bikila
        buyer_user, _ = User.objects.update_or_create(
            email="buyer@yougomart.et",
            defaults={
                "username": "abebe_buyer",
                "phone": "+251944556677",
                "role": "buyer",
                "is_verified": False,
            }
        )
        buyer_user.set_password("Buyer2026!")
        buyer_user.save()
        UserProfile.objects.update_or_create(
            user=buyer_user,
            defaults={
                "display_name": "Abebe Bikila",
                "bio": "Tech enthusiast and classifieds buyer in Addis Ababa.",
                "city": "Addis Ababa",
            }
        )

        # 4. Realistic Ethiopian Listings
        listings_seed = [
            {
                "seller": tigist_seller,
                "cat_slug": "phones-and-electronics",
                "title": "Apple iPhone 15 Pro Max 256GB Natural Titanium (Dual SIM)",
                "price": 148000,
                "is_negotiable": True,
                "condition": "like_new",
                "brand": "Apple",
                "model": "iPhone 15 Pro Max",
                "city": "Addis Ababa",
                "neighborhood": "Bole",
                "landmark": "Near Edna Mall",
                "is_promoted": True,
                "promotion_type": "featured",
                "views": 432,
                "clicks": 96,
                "desc": "Original Apple iPhone 15 Pro Max 256GB in pristine Natural Titanium color. 98% Battery Health, factory unlocked, supports physical SIM + eSIM. Comes with original braided USB-C cable and box. No scratches or dents. Inspection welcome before cash/telebirr handover in Bole.",
                "images": [
                    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1695048065053-52e67cbdb19a?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "seller": tigist_seller,
                "cat_slug": "computers-and-accessories",
                "title": "MacBook Pro 14 M3 Pro 18GB RAM 512GB SSD Space Black",
                "price": 185000,
                "is_negotiable": True,
                "condition": "like_new",
                "brand": "Apple",
                "model": "MacBook Pro 14 (Late 2023)",
                "city": "Addis Ababa",
                "neighborhood": "Bole",
                "landmark": "Around Medhanialem Church",
                "is_promoted": True,
                "promotion_type": "featured",
                "views": 380,
                "clicks": 62,
                "desc": "Powerful Apple M3 Pro chip with 11-core CPU and 14-core GPU. 18GB unified memory, 512GB fast NVMe SSD, Liquid Retina XDR screen. Space Black finish with fingerprint-resistant anodization. Battery cycle count: 24. Perfect for developers, graphic artists, and video editors.",
                "images": [
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "seller": tigist_seller,
                "cat_slug": "phones-and-electronics",
                "title": "Samsung Galaxy S24 Ultra 512GB Titanium Gray with S-Pen",
                "price": 135000,
                "is_negotiable": False,
                "condition": "brand_new",
                "brand": "Samsung",
                "model": "Galaxy S24 Ultra",
                "city": "Addis Ababa",
                "neighborhood": "Kazanchis",
                "landmark": "Next to Inter Luxury Hotel",
                "is_promoted": False,
                "views": 295,
                "clicks": 44,
                "desc": "Brand new factory sealed Samsung Galaxy S24 Ultra, 512GB storage, 12GB RAM. Galaxy AI enabled, 200MP Quad Tele camera, Titanium Gray finish. Includes 1 year shop guarantee. Can test IMEI on arrival.",
                "images": [
                    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "seller": dawit_seller,
                "cat_slug": "vehicles",
                "title": "Toyota RAV4 2022 Hybrid AWD (Euro Spec - Full Option)",
                "price": 4850000,
                "is_negotiable": True,
                "condition": "used_good",
                "brand": "Toyota",
                "model": "RAV4 Hybrid",
                "city": "Addis Ababa",
                "neighborhood": "Bole",
                "landmark": "Atlas Road",
                "is_promoted": True,
                "promotion_type": "featured",
                "views": 850,
                "clicks": 180,
                "desc": "2022 Toyota RAV4 Hybrid with intelligent All-Wheel Drive. Mileage: 28,000 km. Pearl White exterior, leather interior, panoramic sunroof, 360-degree cameras, JBL sound system. Full Ethiopian customs duty paid, clean title and registration plate. Contact directly for scheduled viewing.",
                "images": [
                    "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "seller": dawit_seller,
                "cat_slug": "vehicles",
                "title": "Toyota Vitz 2018 Automatic Clean Engine & Suspension",
                "price": 1950000,
                "is_negotiable": True,
                "condition": "used_good",
                "brand": "Toyota",
                "model": "Vitz 3rd Gen",
                "city": "Addis Ababa",
                "neighborhood": "Sarbet",
                "landmark": "Behind International Community School",
                "is_promoted": False,
                "views": 520,
                "clicks": 110,
                "desc": "Toyota Vitz 2018 model in silver metallic. Extremely fuel efficient (1.0L engine), automatic gearbox, chilling AC, power windows, clean upholstery. Perfect daily city car for Addis traffic. No mechanical issues.",
                "images": [
                    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "seller": selam_seller,
                "cat_slug": "home-and-furniture",
                "title": "Modern L-Shape Fabric Living Room Sofa (Dark Grey)",
                "price": 42000,
                "is_negotiable": True,
                "condition": "brand_new",
                "brand": "Sheger Woodcraft",
                "model": "Nordic L-Sectional",
                "city": "Addis Ababa",
                "neighborhood": "CMC",
                "landmark": "Around St. Michael Church",
                "is_promoted": True,
                "promotion_type": "top",
                "views": 310,
                "clicks": 75,
                "desc": "Custom handcrafted L-shaped corner sectional sofa. High-density orthopedic foam, stain-resistant imported fabric, solid eucalyptus and wanza wood frame. Comes with 4 complimentary accent pillows. Free delivery arrangement in Addis Ababa.",
                "images": [
                    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "seller": selam_seller,
                "cat_slug": "fashion-and-clothing",
                "title": "Handmade Habesha Traditional Kemis (Festive Tilet Design)",
                "price": 185000 / 10, # 18,500 ETB
                "is_negotiable": True,
                "condition": "brand_new",
                "brand": "Sheger Habesha",
                "model": "Royal Shewa Embroidery",
                "city": "Addis Ababa",
                "neighborhood": "Piassa",
                "landmark": "Near Tayitu Hotel",
                "is_promoted": False,
                "views": 240,
                "clicks": 58,
                "desc": "Exquisite hand-woven Ethiopian pure cotton (shemma) dress with intricate golden and crimson tilet borders. Matching netela included. Tailored for weddings, holiday celebrations, and formal ceremonies. Custom sizing adjustments available.",
                "images": [
                    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "seller": tigist_seller,
                "cat_slug": "phones-and-electronics",
                "title": "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
                "price": 38000,
                "is_negotiable": False,
                "condition": "brand_new",
                "brand": "Sony",
                "model": "WH-1000XM5",
                "city": "Addis Ababa",
                "neighborhood": "Megenagna",
                "landmark": "Zefmesh Grand Mall Area",
                "is_promoted": False,
                "views": 180,
                "clicks": 32,
                "desc": "Industry-leading active noise cancelation with two processors and 8 microphones. 30 hours battery life with quick charging, crystal-clear hands-free calling, premium silver finish. In original sealed retail packaging.",
                "images": [
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "seller": tigist_seller,
                "cat_slug": "computers-and-accessories",
                "title": "Dell XPS 15 9530 Core i7 32GB RAM 1TB SSD RTX 4060",
                "price": 125000,
                "is_negotiable": True,
                "condition": "like_new",
                "brand": "Dell",
                "model": "XPS 15 9530",
                "city": "Addis Ababa",
                "neighborhood": "Bole",
                "landmark": "Japan Embassy Road",
                "is_promoted": False,
                "views": 210,
                "clicks": 45,
                "desc": "Intel 13th Gen Core i7-13700H, 32GB DDR5 RAM, 1TB NVMe Gen4 SSD, NVIDIA GeForce RTX 4060 8GB GDDR6. 3.5K OLED touchscreen display with 100% DCI-P3 color gamut. Precision CNC aluminum chassis with carbon fiber palm rest.",
                "images": [
                    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "seller": dawit_seller,
                "cat_slug": "sports-and-hobbies",
                "title": "Trek Marlin 7 Mountain Bike (Shimano Deore 1x10)",
                "price": 48000,
                "is_negotiable": True,
                "condition": "used_good",
                "brand": "Trek",
                "model": "Marlin 7 Gen 2",
                "city": "Adama (Nazret)",
                "neighborhood": "Franco",
                "landmark": "Near Ras Hotel",
                "is_promoted": False,
                "views": 140,
                "clicks": 28,
                "desc": "Alpha Silver aluminum frame, RockShox Judy front fork with hydraulic lockout, Shimano Deore 1x10 drivetrain, Shimano hydraulic disc brakes. 29-inch Bontrager wheels with tubeless-ready tires. Ideal for fitness, road, and trails.",
                "images": [
                    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "seller": dawit_seller,
                "cat_slug": "property",
                "title": "Luxury 3-Bedroom Furnished Apartment for Rent in Bole",
                "price": 85000,
                "is_negotiable": True,
                "condition": "like_new",
                "brand": "Real Estate",
                "model": "3 Bed Luxury",
                "city": "Addis Ababa",
                "neighborhood": "Bole",
                "landmark": "Near Rwanda Embassy",
                "is_promoted": True,
                "promotion_type": "featured",
                "views": 670,
                "clicks": 142,
                "desc": "Spacious 180 sqm high-rise apartment on the 7th floor. 3 ensuite bedrooms, modern modular kitchen with appliances, standby 250kVA generator, dedicated underground parking, 24/7 security, high speed fiber internet installed.",
                "images": [
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "seller": tigist_seller,
                "cat_slug": "jewelry-and-accessories",
                "title": "Rolex Submariner Date 41mm Oystersteel Ceramic Bezel",
                "price": 1200000,
                "is_negotiable": True,
                "condition": "like_new",
                "brand": "Rolex",
                "model": "Submariner 126610LN",
                "city": "Addis Ababa",
                "neighborhood": "Bole",
                "landmark": "Olympia Area",
                "is_promoted": False,
                "views": 410,
                "clicks": 88,
                "desc": "Authentic Rolex Submariner Date 41mm Reference 126610LN. Black dial with Chromalight display, unidirectional Cerachrom ceramic bezel, Calibre 3235 perpetual movement. Complete set including original green box, warranty card, and tags. Buyer verification welcome at certified watchmaker.",
                "images": [
                    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
                ]
            }
        ]

        created_listings = []
        for ldata in listings_seed:
            cat = cat_objs.get(ldata["cat_slug"])
            if not cat:
                continue

            listing, _ = Listing.objects.update_or_create(
                title=ldata["title"],
                seller=ldata["seller"],
                defaults={
                    "category": cat,
                    "description": ldata["desc"],
                    "price": ldata["price"],
                    "currency": "ETB",
                    "is_negotiable": ldata["is_negotiable"],
                    "condition": ldata["condition"],
                    "brand": ldata["brand"],
                    "model": ldata["model"],
                    "country": "Ethiopia",
                    "region": "Addis Ababa" if ldata["city"] == "Addis Ababa" else "Oromia",
                    "city": ldata["city"],
                    "neighborhood": ldata["neighborhood"],
                    "landmark": ldata["landmark"],
                    "status": "active",
                    "is_promoted": ldata["is_promoted"],
                    "promotion_type": ldata.get("promotion_type", "none"),
                    "views_count": ldata["views"],
                    "contact_clicks_count": ldata["clicks"]
                }
            )
            created_listings.append(listing)

            # Add images
            ListingImage.objects.filter(listing=listing).delete()
            for idx, img_url in enumerate(ldata["images"]):
                ListingImage.objects.create(
                    listing=listing,
                    image_url=img_url,
                    display_order=idx,
                    is_primary=(idx == 0)
                )

        self.stdout.write(f"Listings created: {len(created_listings)}")

        # 5. Favorite for Abebe (Buyer)
        if created_listings:
            Favorite.objects.get_or_create(user=buyer_user, listing=created_listings[0])
            Favorite.objects.get_or_create(user=buyer_user, listing=created_listings[1])

        # 6. Sample In-Platform Conversation between Abebe and Tigist
        if created_listings:
            sample_listing = created_listings[0]
            conv, _ = Conversation.objects.get_or_create(listing=sample_listing)
            ConversationParticipant.objects.get_or_create(conversation=conv, user=buyer_user)
            ConversationParticipant.objects.get_or_create(conversation=conv, user=tigist_user)

            Message.objects.filter(conversation=conv).delete()
            Message.objects.create(
                conversation=conv,
                sender=buyer_user,
                content="Hello Tigist! Is the iPhone 15 Pro Max still available? Can we meet in Bole around afternoon?",
                is_read=True
            )
            Message.objects.create(
                conversation=conv,
                sender=tigist_user,
                content="Salam Abebe! Yes, it is available. I can meet you at Bole Edna Mall near the coffee shop around 3:00 PM. You can test everything on the phone before deciding.",
                is_read=True
            )
            Message.objects.create(
                conversation=conv,
                sender=buyer_user,
                content="Perfect! 3:00 PM works for me. I will pay via telebirr or cash as you prefer.",
                is_read=False
            )

        # 7. Sample Notification for Tigist
        Notification.objects.get_or_create(
            recipient=tigist_user,
            title="Verified Seller Badge Approved!",
            defaults={
                "notification_type": "verification",
                "message": "Welcome to youGO-mart Verified Sellers! Your badge is now active on all your product cards.",
                "link": "/dashboard",
                "is_read": False
            }
        )

        # 8. Sample Audit Log
        AuditLog.objects.create(
            actor=admin_user,
            action="SYSTEM_INIT",
            target_type="System",
            target_id="1",
            details="Database seeded with initial categories, verified sellers, and listings."
        )

        self.stdout.write(self.style.SUCCESS("youGO-mart database successfully populated!"))
