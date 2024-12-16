import type { SchemaType } from "@repo/ayasofyazilim-ui/lib/create-zod-object";

export const $schema_details: SchemaType = {
  type: "object",
  displayName: "Example Schema Display Name", // Add this line
  properties: {
    taxFreeTagFacturaNumber: {
      type: "string",
      description: "The tax-free tag or invoice number.",
    },
    date: {
      type: "string",
      format: "date-time",
      description: "The date of the transaction.",
    },
    traveller: {
      type: "string",
      description: "The name of the traveller.",
    },
    company: {
      type: "string",
      description: "The name of the company involved in the transaction.",
    },
    salesAmount: {
      type: "number",
      description: "The amount of sales in the transaction.",
    },
    refund: {
      type: "number",
      description: "The amount refunded.",
    },
    status: {
      type: "string",
      enum: ["Pending", "Completed", "Cancelled"],
      description: "The status of the transaction.",
    },
  },
  required: [
    "taxFreeTagFacturaNumber",
    "date",
    "traveller",
    "company",
    "salesAmount",
    "refund",
    "status",
  ],
  additionalProperties: false,
};

export interface TaxFreeTag {
  taxFreeTagFacturaNumber: string;
  date: string;
  traveller: string;
  company: string;
  salesAmount: number;
  refund: number;
  status: "Completed" | "Pending" | "Cancelled";
}

export const $schema_list: TaxFreeTag[] = [
  {
    taxFreeTagFacturaNumber: "TF123456",
    date: "2024-08-01",
    traveller: "Alice Johnson",
    company: "TravelTech Ltd.",
    salesAmount: 1200.0,
    refund: 100.0,
    status: "Completed",
  },
  {
    taxFreeTagFacturaNumber: "TF123457",
    date: "2024-08-02",
    traveller: "Bob Smith",
    company: "Global Tours Inc.",
    salesAmount: 800.0,
    refund: 50.0,
    status: "Pending",
  },
  {
    taxFreeTagFacturaNumber: "TF123458",
    date: "2024-08-03",
    traveller: "Carol Davis",
    company: "Holiday Makers",
    salesAmount: 1500.0,
    refund: 200.0,
    status: "Completed",
  },
  {
    taxFreeTagFacturaNumber: "TF123459",
    date: "2024-08-04",
    traveller: "David Wilson",
    company: "TravelTech Ltd.",
    salesAmount: 500.0,
    refund: 0.0,
    status: "Cancelled",
  },
  {
    taxFreeTagFacturaNumber: "TF123460",
    date: "2024-08-05",
    traveller: "Emma Brown",
    company: "Global Tours Inc.",
    salesAmount: 1000.0,
    refund: 75.0,
    status: "Completed",
  },
  {
    taxFreeTagFacturaNumber: "TF123461",
    date: "2024-08-06",
    traveller: "Frank Harris",
    company: "Holiday Makers",
    salesAmount: 600.0,
    refund: 60.0,
    status: "Pending",
  },
  {
    taxFreeTagFacturaNumber: "TF123462",
    date: "2024-08-07",
    traveller: "Grace Lee",
    company: "TravelTech Ltd.",
    salesAmount: 900.0,
    refund: 90.0,
    status: "Completed",
  },
  {
    taxFreeTagFacturaNumber: "TF123463",
    date: "2024-08-08",
    traveller: "Henry Clark",
    company: "Global Tours Inc.",
    salesAmount: 750.0,
    refund: 30.0,
    status: "Completed",
  },
  {
    taxFreeTagFacturaNumber: "TF123464",
    date: "2024-08-09",
    traveller: "Ivy Martinez",
    company: "Holiday Makers",
    salesAmount: 1300.0,
    refund: 150.0,
    status: "Pending",
  },
  {
    taxFreeTagFacturaNumber: "TF123465",
    date: "2024-08-10",
    traveller: "Jack Thompson",
    company: "TravelTech Ltd.",
    salesAmount: 400.0,
    refund: 20.0,
    status: "Completed",
  },
  {
    taxFreeTagFacturaNumber: "TF123466",
    date: "2024-08-11",
    traveller: "Karen White",
    company: "Global Tours Inc.",
    salesAmount: 1100.0,
    refund: 120.0,
    status: "Cancelled",
  },
  {
    taxFreeTagFacturaNumber: "TF123467",
    date: "2024-08-12",
    traveller: "Louis Anderson",
    company: "Holiday Makers",
    salesAmount: 1400.0,
    refund: 200.0,
    status: "Completed",
  },
  {
    taxFreeTagFacturaNumber: "TF123468",
    date: "2024-08-13",
    traveller: "Mona Harris",
    company: "TravelTech Ltd.",
    salesAmount: 850.0,
    refund: 90.0,
    status: "Pending",
  },
  {
    taxFreeTagFacturaNumber: "TF123469",
    date: "2024-08-14",
    traveller: "Nathan King",
    company: "Global Tours Inc.",
    salesAmount: 550.0,
    refund: 30.0,
    status: "Completed",
  },
  {
    taxFreeTagFacturaNumber: "TF123470",
    date: "2024-08-15",
    traveller: "Olivia Scott",
    company: "Holiday Makers",
    salesAmount: 1600.0,
    refund: 180.0,
    status: "Cancelled",
  },
];

const generateTagsFromSchemaList = (schemaList: typeof $schema_list) => {
  return schemaList.map((item, index) => {
    let statusValue = 1;
    switch (item.status) {
      case "Completed":
        statusValue = 1;
        break;
      case "Pending":
        statusValue = 2;
        break;
      default:
        statusValue = 3;
        break;
    }
    return {
      Id: `TAG${index + 1}`, // Example tag ID, you can generate it based on your needs
      Summary: {
        Tag: item.taxFreeTagFacturaNumber,
        Status: statusValue,
        RefundMethod: 2, // Assuming a default value, adjust based on your logic
        IssuedDate: item.date,
        ExpireDate: "2024-12-31", // Default value, adjust based on your logic
      },
      ExportValidation: {
        Id: `EV${index + 1}`, // Example export validation ID
        ExportDate: item.date,
        ExportLocation: 101, // Example location, adjust based on your logic
        StampType: 3, // Example stamp type, adjust based on your logic
      },
      Refund: {
        Id: `R${index + 1}`, // Example refund ID
        SubmissionDate: item.date,
        PaidDate: item.status === "Completed" ? "2024-08-13" : "", // Example logic for PaidDate
        RefundLocation: {
          ID: "RL001", // Example refund location ID
          Name: "Refund Location Name", // Example refund location name
        },
        Status: statusValue,
        RefundMethod: 2, // Assuming a default value, adjust based on your logic
      },
      Invoicing: {
        Id: `INV${index + 1}`, // Example invoicing ID
        InvoicingDate: "2024-08-09", // Default value, adjust based on your logic
        InvoicingNumber: `INV000${index + 1}`, // Example invoicing number
        InvoicingStatus: item.status === "Completed" ? 1 : 2, // Example logic for invoicing status
      },
      Merchant: {
        Id: `M${index + 1}`, // Example merchant ID
        Name: item.company, // Using the company name as the merchant name
        ProductGroups: [
          {
            Id: `PG001`, // Example product group ID
            Description: "Product Group 1", // Example product group description
          },
        ],
        Address: {
          Id: `A${index + 1}`, // Example address ID
          FullText: "1234 Sample Street, City, Country", // Example address, adjust based on your logic
        },
      },
      Traveller: {
        Id: `T${index + 1}`, // Example traveller ID
        TravelDocumentNumber: "TN123456789", // Example travel document number
        CountryOfResidenceCode: 100, // Example country code
        CountryOfResidence: "Country Name", // Example country name
        NationalityCode: 200, // Example nationality code
        Nationality: "Nationality Name", // Example nationality name
        Name: item.traveller.split(" ")[0], // Assuming first name from traveller name
        Surname: item.traveller.split(" ")[1], // Assuming surname from traveller name
      },
      Trip: {
        Id: `TR${index + 1}`, // Example trip ID
        VisitingDate: "2024-08-01", // Default value, adjust based on your logic
        DepartureDate: "2024-08-05", // Default value, adjust based on your logic
        FlightNumber: "FL1234", // Example flight number
        DepartingAirport: {
          Id: "DA001", // Example departing airport ID
          Name: "Departing Airport Name", // Example departing airport name
        },
        DestinationAirport: {
          Id: "DA002", // Example destination airport ID
          Name: "Destination Airport Name", // Example destination airport name
        },
      },
      Invoices: [
        {
          Id: `I${index + 1}`,
          Number: `INV00${index + 1}`,
          Currency: {
            Id: "CUR001",
            Currency: "USD",
            CurrencySymbol: "$",
          },
          TotalAmount: item.salesAmount,
          InvoiceLines: [
            {
              Id: `IL001`,
              ProductGroup: {
                Id: "PG001",
                Description: "Product Group 1",
              },
              Amount: item.salesAmount / 2, // Example logic to split sales amount
              Vat: {
                Id: "VAT001",
                Rate: 5.0,
                Amount: (item.salesAmount / 2) * 0.05, // Example VAT calculation
                VatBase: (item.salesAmount / 2) * 0.95, // Example VAT base calculation
              },
            },
          ],
        },
      ],
      Totals: [
        {
          Description: "Amount",
          Amount: item.salesAmount,
        },
        {
          Description: "Refund",
          Amount: item.refund,
        },
        {
          Description: "Income",
          Amount: item.salesAmount - item.refund,
        },
      ],
      Earnings: [
        {
          Description: "Total Earnings",
          Amount: item.salesAmount * 0.02, // Example earnings calculation
        },
        {
          Description: "Customer Earnings",
          Amount: item.refund * 0.01, // Example customer earnings calculation
        },
        {
          Description: "Refund point Earnings",
          Amount: item.refund * 0.005, // Example refund point earnings calculation
        },
        {
          Description: "Merchant Earnings",
          Amount: (item.salesAmount - item.refund) * 0.01, // Example merchant earnings calculation
        },
      ],
    };
  });
};

export function getIndexOfTagByFacturaId(facturaId: string) {
  return $schema_list.findIndex(
    (item) => item.taxFreeTagFacturaNumber === facturaId,
  );
}

export const tags = generateTagsFromSchemaList($schema_list);
