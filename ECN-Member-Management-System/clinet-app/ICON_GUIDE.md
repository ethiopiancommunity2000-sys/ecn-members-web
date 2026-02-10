# Icon Guide for Home Page

## Current Icons Used

The icons in the "What We Offer" section are from **Material-UI Icons** (`@mui/icons-material`), which is already installed in your project.

### Current Icons:
1. **Community Support**: `Groups` icon
2. **Volunteer Opportunities**: `VolunteerActivism` icon  
3. **Mutual Assistance**: `Handshake` icon

## How to Change Icons

### Option 1: Use Different Material-UI Icons

1. **Browse available icons**: https://mui.com/material-ui/material-icons/
2. **Find the icon name** you want (e.g., `People`, `Support`, `Work`)
3. **Import it** at the top of `Home.tsx`:
   ```typescript
   import { People, Work, Help } from '@mui/icons-material';
   ```
4. **Replace the icon** in the card:
   ```typescript
   <People sx={{ fontSize: 60, color: '#218aae', mb: 2 }} />
   ```

### Popular Alternative Icons:

**For Community Support:**
- `People` - Multiple people icon
- `Support` - Support/help icon
- `Help` - Help/question icon
- `Diversity3` - Diversity/community icon
- `EmojiPeople` - People emoji icon

**For Volunteer Opportunities:**
- `Work` - Work/briefcase icon
- `Business` - Business icon
- `LocalLibrary` - Library/education icon
- `School` - School icon
- `Event` - Event icon

**For Mutual Assistance:**
- `Handshake` - Current (handshake icon)
- `Favorite` - Heart/favorite icon
- `Support` - Support icon
- `HelpOutline` - Help outline icon
- `HandshakeOutlined` - Outlined handshake

### Option 2: Use Image Files

If you want to use actual image files instead of icons:

1. **Add your image** to the `public` folder:
   - Example: `clinet-app/public/community-support.png`

2. **Replace the icon** with an image:
   ```typescript
   <Box
     component="img"
     src="/community-support.png"
     alt="Community Support"
     sx={{
       width: 60,
       height: 60,
       mb: 2,
       objectFit: 'contain'
     }}
   />
   ```

3. **Or use an external image URL**:
   ```typescript
   <Box
     component="img"
     src="https://your-image-url.com/image.png"
     alt="Community Support"
     sx={{
       width: 60,
       height: 60,
       mb: 2,
       objectFit: 'contain'
     }}
   />
   ```

## Where to Get Images (if using Option 2)

1. **Unsplash** (Free): https://unsplash.com/
   - Search for: "community", "volunteer", "support", "teamwork"
   - Free to use, high quality

2. **Pexels** (Free): https://www.pexels.com/
   - Free stock photos and icons

3. **Flaticon** (Free/Paid): https://www.flaticon.com/
   - Free icons with attribution

4. **Material Icons** (Google): https://fonts.google.com/icons
   - Free Material Design icons

## Example: Changing to Different Icons

```typescript
// In Home.tsx, change the import:
import { People, Work, Help } from '@mui/icons-material';

// Then replace in the cards:
<People sx={{ fontSize: 60, color: '#218aae', mb: 2 }} />  // Community Support
<Work sx={{ fontSize: 60, color: '#218aae', mb: 2 }} />    // Volunteer Opportunities
<Help sx={{ fontSize: 60, color: '#218aae', mb: 2 }} />    // Mutual Assistance
```

## Current Icon Colors

All icons use: `color: '#218aae'` (blue color matching your theme)

You can change the color by modifying the `color` property in the `sx` prop.

