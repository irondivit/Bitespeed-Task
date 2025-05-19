import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/contacts', async (req, res) => {
  const { email, phoneNumber } = req.query;

  let contacts;

  if (email || phoneNumber) {
    contacts = await prisma.contact.findMany({
      where: {
        OR: [
          { email: typeof email === 'string' ? email : undefined },
          { phoneNumber: typeof phoneNumber === 'string' ? phoneNumber : undefined }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
  } else {
    contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'asc' }
    });
  }

  res.json({ count: contacts.length, contacts });
});


app.post('/identify', async (req, res) => {
  const { email, phoneNumber } = req.body;

  const matchingContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined }
      ]
    }
  });

  let primary: any = null;

  // If matches found
  if (matchingContacts.length > 0) {
    // Get all related contacts from same identity cluster
    const allContacts = await prisma.contact.findMany({
      where: {
        OR: [
          { id: { in: matchingContacts.map(c => c.id) } },
          { linkedId: { in: matchingContacts.map(c => c.id) } }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    // Determine primary
    primary = allContacts.find(c => c.linkPrecedence === 'primary');

    // Update primaries if needed
    for (const c of allContacts) {
      if (c.id !== primary.id && c.linkPrecedence === 'primary') {
        await prisma.contact.update({
          where: { id: c.id },
          data: {
            linkPrecedence: 'secondary',
            linkedId: primary.id
          }
        });
      }
    }

    // Create new secondary if input has new info
    const alreadyExists = allContacts.some(c =>
      c.email === email && c.phoneNumber === phoneNumber
    );

    if (!alreadyExists && (email || phoneNumber)) {
      await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkedId: primary.id,
          linkPrecedence: 'secondary'
        }
      });
    }

    const finalContacts = await prisma.contact.findMany({
      where: {
        OR: [
          { id: primary.id },
          { linkedId: primary.id }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    const emails = [...new Set(finalContacts.map(c => c.email).filter(Boolean))];
    const phoneNumbers = [...new Set(finalContacts.map(c => c.phoneNumber).filter(Boolean))];
    const secondaryContactIds = finalContacts
      .filter(c => c.linkPrecedence === 'secondary')
      .map(c => c.id);

    return res.json({
      contact: {
        primaryContactId: primary.id,
        emails,
        phoneNumbers,
        secondaryContactIds
      }
    });

  } else {
    // No match found — create new primary
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: 'primary'
      }
    });

    return res.json({
      contact: {
        primaryContactId: newContact.id,
        emails: [email],
        phoneNumbers: [phoneNumber],
        secondaryContactIds: []
      }
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
