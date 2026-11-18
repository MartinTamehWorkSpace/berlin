# Glow City Autohaus: ein Auto pro Aufruf in Blender bauen und rendern (Cycles, Studiolicht, transparenter Hintergrund)
# Aufruf: Blender -b --factory-startup --python auto_blender.py -- <stufe 1-5> <ausgabe.png> [samples]
import bpy, bmesh, math, sys
from mathutils import Vector
a = sys.argv[sys.argv.index('--') + 1:]
LVL, OUT = int(a[0]), a[1]; SAMPLES = int(a[2]) if len(a) > 2 else 96

CARS = {
 1: dict(col=(190,30,38), rim=(220,224,228), L=3.6, W=1.66, wr=.3, wh=[.62,2.95], belt=1.0, roof=.8, pil=[1.55,1.67], lights='round',
         p=[[0,.35],[0,.95],[.06,1.25,'g'],[.28,1.48],[1.9,1.5],[2.6,1.05,'g'],[3.35,.92],[3.6,.7],[3.6,.35]]),
 2: dict(col=(92,96,102), rim=(190,194,199), L=4.75, W=1.85, wr=.35, wh=[1.02,3.85], belt=.98, roof=.7, pil=[2.1,2.2], lights='strip', grille=1,
         p=[[0,.4],[0,.92],[.25,1],[1.0,1.3,'g'],[2.4,1.36],[3.15,1,'g'],[4.55,.82],[4.75,.6],[4.75,.4]]),
 3: dict(col=(30,31,34), rim=(26,27,30), matte=1, L=4.85, W=1.98, wr=.42, wh=[.98,3.85], belt=1.5, roof=.96, box=1, pil=[1.9,2.02], lights='round', grille=1,
         p=[[0,.45],[0,1.94],[.06,2],[3.6,2],[3.72,1.52,'g'],[4.75,1.46],[4.85,1.36],[4.85,.45]]),
 4: dict(col=(74,168,48), rim=(28,28,30), L=4.7, W=2.05, wr=.36, wh=[1.08,3.85], belt=.95, roof=.5, pil=[9,9], lights='strip',
         p=[[0,.36],[0,.86],[.55,.98],[1.6,1.12],[2.25,1.14],[3.35,.78,'g'],[4.55,.47],[4.7,.36]]),
 5: dict(col=(232,235,240), rim=(205,209,215), chrome=1, fly=1, L=4.65, W=2.0, wr=.36, wh=[1.02,3.8], belt=.9, roof=.56, glassRoof=1, pil=[9,9], lights='strip',
         p=[[0,.38],[0,.76],[.35,.88],[1.3,1.13],[2.1,1.22,'g'],[3.0,1.02,'g'],[3.9,.73],[4.5,.6],[4.65,.46],[4.65,.38]]),
}
c = CARS[LVL]
if len(a) > 4: c['col'] = tuple(int(a[4][i:i+2], 16) for i in (0, 2, 4)); c.pop('chrome', None)
SUF = a[5] if len(a) > 5 else ''
# Lamborgia neu in Rosa
CARS[4]['col'] = (236, 150, 190)

def lin(rgb):  # sRGB 0..255 nach linear
    return tuple(((v/255)/12.92 if v/255 <= .04045 else ((v/255+.055)/1.055)**2.4) for v in rgb) + (1,)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'METAL'; prefs.get_devices()
    for d in prefs.devices: d.use = True
    sc.cycles.device = 'GPU'
except Exception: pass
sc.render.resolution_x, sc.render.resolution_y = 1400, 980
sc.render.film_transparent = True
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'

# Welt: Studio-Verlauf, oben hell, unten dunkel (sorgt für die Spiegelungen im Lack)
w = bpy.data.worlds.new('W'); sc.world = w; w.use_nodes = True; nt = w.node_tree; n = nt.nodes
bg = n['Background']; tc = n.new('ShaderNodeTexCoord'); sep = n.new('ShaderNodeSeparateXYZ'); ramp = n.new('ShaderNodeValToRGB')
nt.links.new(tc.outputs['Generated'], sep.inputs[0]); nt.links.new(sep.outputs['Z'], ramp.inputs[0]); nt.links.new(ramp.outputs[0], bg.inputs[0])
el = ramp.color_ramp.elements; el[0].position = .47; el[0].color = (.012, .012, .016, 1); el[1].position = .62; el[1].color = (.75, .78, .85, 1)
mid = el.new(.5); mid.color = (.09, .085, .08, 1)
bg.inputs[1].default_value = .55

def mat(name, base, metal=0, rough=.3, coat=0, emis=None, es=0, alpha=1):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = base; b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = .02
    if emis: b.inputs['Emission Color'].default_value = emis; b.inputs['Emission Strength'].default_value = es
    return m
if c.get('chrome'):
    PAINT = mat('Chrom', (.96, .97, .98, 1), metal=1, rough=.035)
elif c.get('matte'):
    PAINT = mat('Lack matt', lin(c['col']), metal=.25, rough=.5)
else:
    PAINT = mat('Lack', lin(c['col']), metal=.45, rough=.32, coat=1)
# Glas glänzt bei mattem Lack stärker, damit die Scheiben sichtbar bleiben
GLASS = mat('Glas', (.004, .006, .009, 1), rough=.02 if c.get('matte') else .06, coat=1 if c.get('matte') else .25)
DARK = mat('Schwarz', (.01, .01, .012, 1), rough=.45)
TAIL = mat('Ruecklicht', (.5, .02, .03, 1), rough=.15, emis=(1, .05, .08, 1), es=6)
HEAD = mat('Scheinwerfer', (1, 1, 1, 1), rough=.1, emis=(.92, .97, 1, 1), es=14)
TIRE = mat('Reifen', (.018, .018, .02, 1), rough=.75)
RIM = mat('Felge', lin(c['rim']), metal=1, rough=.18)
CHROME = mat('Zierleiste', (.95, .95, .96, 1), metal=1, rough=.05)
GLOW = mat('Antrieb', (.3, .9, 1, 1), emis=(.45, .9, 1, 1), es=25)

def smooth(pts, it):
    p = pts
    for _ in range(it):
        o = [p[0]]
        for i in range(len(p) - 1):
            ax, az = p[i][0], p[i][1]; bx, bz = p[i+1][0], p[i+1][1]; gl = p[i+1][2] if len(p[i+1]) > 2 else None
            o.append([.75*ax+.25*bx, .75*az+.25*bz, gl]); o.append([.25*ax+.75*bx, .25*az+.75*bz, gl])
        o.append(p[-1]); p = o
    return p
def top_at(p, x):
    best, gl = -1, False
    for i in range(len(p) - 1):
        ax, az = p[i][0], p[i][1]; bx, bz = p[i+1][0], p[i+1][1]; f = p[i+1][2] if len(p[i+1]) > 2 else None
        if bx == ax: continue
        if min(ax, bx) <= x <= max(ax, bx):
            z = az + (bz - az) * (x - ax) / (bx - ax)
            if z > best: best, gl = z, f == 'g'
    return best, gl

# ---------- Karosserie: Querschnitte entlang der Länge, dann geglättet ----------
L, W, box = c['L'], c['W'], c.get('box')
prof = smooth(c['p'], 1 if box else 3); N = 44 if box else 64
# Scheiben nach den Originalabschnitten, damit sie beim Glätten nicht wandern
GR = [(min(c['p'][i][0], c['p'][i+1][0]), max(c['p'][i][0], c['p'][i+1][0])) for i in range(len(c['p'])-1) if len(c['p'][i+1]) > 2]
rings = []
for i in range(N + 1):
    x = .02 + (L - .04) * i / N
    zt, _ = top_at(prof, x)
    gl = any(a0 - .02 <= x <= a1 + .02 for a0, a1 in GR)
    t = abs(2 * x / L - 1); ex = 14 if box else 5
    hw = W / 2 * max(.92 if box else .55, (1 - t ** ex) ** (1 / ex))
    zb = .28
    for wx in c['wh']:
        r = c['wr'] * 1.17
        if abs(x - wx) < r: zb = max(zb, c['wr'] + math.sqrt(r*r - (x - wx) ** 2) * .93)
    if t > .93: zb = max(zb, .3 + (t - .93) * 3)
    zb = min(zb, zt - .12)
    zs = min(c['belt'], zt - .05); gH = max(0, zt - zs); gr = gH > .12
    ring = [(hw*.84, zb), (hw*.97, min(zb + .08, zs)), (hw, zb + (zs - zb) * .55), (hw*.985, zs),
            (hw*(.97 if box else .92), zs + (.03 if gr else .015)), (hw*((.95 if box else .8) if gr else .78), zs + (gH*.82 if gr else gH*.6)),
            (hw*(c['roof'] if gr else .45), zt), (0, zt + (0 if box else .02))]
    win = gr and not (c['pil'][0] < x < c['pil'][1]) and zt - c['belt'] > .2
    rings.append(dict(x=x, ring=ring, gl=gl, win=win, gr=gr))

bm = bmesh.new(); V = []
for R in rings:
    pts = [(y, z) for y, z in R['ring']] + [(-y, z) for y, z in reversed(R['ring'][:-1])]
    V.append([bm.verts.new((R['x'], y, z)) for y, z in pts])
M = len(V[0])
def seg_j(k):
    if k < 7: return k
    if k < 14: return 13 - k
    return -1
for i in range(N):
    A, B = rings[i], rings[i+1]
    for k in range(M):
        f = bm.faces.new((V[i][k], V[i+1][k], V[i+1][(k+1) % M], V[i][(k+1) % M]))
        j = seg_j(k); mi = 0
        if j in (-1, 0, 1): mi = 2
        elif j == 4 and A['win'] and B['win']: mi = 1
        elif j >= 5 and (A['gl'] or B['gl']): mi = 1
        elif j >= 5 and c.get('glassRoof') and A['gr'] and B['gr']: mi = 1
        if A['x'] < .16 and j in (2, 3): mi = 3
        f.material_index = mi
bm.faces.new(list(reversed(V[0]))); bm.faces.new(V[-1])
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
cl = bm.edges.layers.float.get('crease_edge') or bm.edges.layers.float.new('crease_edge')
for i in range(N):
    for k, cv in ((3, .8), (11, .8), (4, .6), (10, .6)):
        e_ = bm.edges.get((V[i][k], V[i+1][k]))
        if e_: e_[cl] = cv
me = bpy.data.meshes.new('Karosserie'); bm.to_mesh(me); bm.free()
body = bpy.data.objects.new('Karosserie', me); sc.collection.objects.link(body)
for m in (PAINT, GLASS, DARK, TAIL): me.materials.append(m)
sub = body.modifiers.new('S', 'SUBSURF'); sub.levels = sub.render_levels = 1 if box else 2
for poly in me.polygons: poly.use_smooth = True

parts = [body]
def add(o, m):
    o.data.materials.append(m); parts.append(o); return o
# Räder: Reifen, Felge mit Speichen, Nabe
for wx in c['wh']:
    for s in (1, -1):
        y = s * (W / 2 - .15)
        bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=c['wr'], depth=.26, location=(wx, y, c['wr']), rotation=(math.pi/2, 0, 0))
        t = add(bpy.context.object, TIRE); bv = t.modifiers.new('B', 'BEVEL'); bv.width = .05; bv.segments = 4
        bpy.ops.object.shade_smooth()
        bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=c['wr']*.68, depth=.27, location=(wx, y + s*.002, c['wr']), rotation=(math.pi/2, 0, 0))
        add(bpy.context.object, DARK)
        for kk in range(5):
            ang = kk / 5 * 2 * math.pi
            bpy.ops.mesh.primitive_cube_add(size=1, location=(wx + math.cos(ang)*c['wr']*.34, y + s*.13, c['wr'] + math.sin(ang)*c['wr']*.34), rotation=(0, -ang, 0))
            o = bpy.context.object; o.scale = (c['wr']*.66, .03, c['wr']*.13); add(o, RIM)
        bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=c['wr']*.66, depth=.02, location=(wx, y + s*.128, c['wr']), rotation=(math.pi/2, 0, 0))
        o = bpy.context.object; add(o, RIM); o.scale = (1, 1, 1)
        # Felgenring statt voller Scheibe: Innenteil abdunkeln
        bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=c['wr']*.56, depth=.025, location=(wx, y + s*.129, c['wr']), rotation=(math.pi/2, 0, 0))
        add(bpy.context.object, DARK)
        for kk in range(5):
            ang = kk / 5 * 2 * math.pi + .3
            bpy.ops.mesh.primitive_cube_add(size=1, location=(wx + math.cos(ang)*c['wr']*.3, y + s*.145, c['wr'] + math.sin(ang)*c['wr']*.3), rotation=(0, -ang, 0))
            o = bpy.context.object; o.scale = (c['wr']*.56, .025, c['wr']*.11); add(o, RIM)
        bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=c['wr']*.12, depth=.04, location=(wx, y + s*.15, c['wr']), rotation=(math.pi/2, 0, 0))
        add(bpy.context.object, RIM)
# Front: Scheinwerfer, Grill
R = rings[-1]; zs_ = R['ring'][3][1]; zb_ = R['ring'][0][1]; hwf = R['ring'][2][0]; fx = R['x'] - .03
zl = zb_ + (zs_ - zb_) * .74
for s in (1, -1):
    if c['lights'] == 'round':
        bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=.11, depth=.08, location=(fx, s*hwf*.66, zl), rotation=(0, math.pi/2, 0))
        add(bpy.context.object, CHROME)
        bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=.085, depth=.09, location=(fx + .005, s*hwf*.66, zl), rotation=(0, math.pi/2, 0))
        add(bpy.context.object, HEAD)
    else:
        bpy.ops.mesh.primitive_cube_add(size=1, location=(fx - .02, s*hwf*.6, zl)); o = bpy.context.object; o.scale = (.12, .36, .035); add(o, HEAD)
if c.get('grille'):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(fx - .01, 0, zb_ + (zs_ - zb_) * .4)); o = bpy.context.object; o.scale = (.08, .74, .26); add(o, DARK)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(fx + .025, 0, zb_ + (zs_ - zb_) * .4)); o = bpy.context.object; o.scale = (.01, .76, .02); add(o, CHROME)
# Rücklicht als Band über das Heck
R0 = rings[0]; zr = R0['ring'][3][1] - .06
bpy.ops.mesh.primitive_cube_add(size=1, location=(R0['x'] + .02, 0, zr)); o = bpy.context.object; o.scale = (.06, R0['ring'][2][0]*1.9, .05); add(o, TAIL)
# Außenspiegel am Fuß der Frontscheibe
xs = max([r['x'] for r in rings if r['gl'] and r['x'] > L * .45] or [L * .6]) - .12
for s in (1, -1):
    hwm = next(r['ring'][2][0] for r in rings if r['x'] >= xs)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(xs, s*(hwm + .03), c['belt'] + .02)); o = bpy.context.object; o.scale = (.12, .2, .085)
    bv = o.modifiers.new('B', 'BEVEL'); bv.width = .035; bv.segments = 3; add(o, PAINT)
# G-Klasse: Reserverad am Heck, Trittbretter, Kotflügelverbreiterungen, Blinker oben auf den Kotflügeln, Dachreling, Grill mit Chromstreben
if c.get('box'):
    BLINK = mat('Blinker', (1, .45, .05, 1), rough=.2, emis=(1, .45, .05, 1), es=4)
    zrad = c['wr'] + .62
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=.4, depth=.24, location=(R0['x'] - .12, 0, zrad), rotation=(0, math.pi/2, 0)); add(bpy.context.object, TIRE)
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=.33, depth=.26, location=(R0['x'] - .13, 0, zrad), rotation=(0, math.pi/2, 0)); add(bpy.context.object, PAINT)
    bpy.ops.mesh.primitive_torus_add(major_radius=.3, minor_radius=.025, location=(R0['x'] - .26, 0, zrad), rotation=(0, math.pi/2, 0)); add(bpy.context.object, CHROME)
    for s in (1, -1):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(L * .5, s * (W / 2 + .06), .42)); o = bpy.context.object; o.scale = (2.3, .16, .05); add(o, DARK)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(L * .5, s * (W / 2 + .14), .45)); o = bpy.context.object; o.scale = (2.3, .02, .02); add(o, CHROME)
        for wx in c['wh']:
            bpy.ops.mesh.primitive_cube_add(size=1, location=(wx, s * (W / 2 + .04), c['wr'] * 2 + .08)); o = bpy.context.object; o.scale = (1.0, .12, .1)
            bv = o.modifiers.new('B', 'BEVEL'); bv.width = .03; bv.segments = 2; add(o, DARK)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(fx - .42, s * hwf * .86, zs_ + .03)); o = bpy.context.object; o.scale = (.14, .09, .07); add(o, BLINK)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(L * .43, s * (W / 2 - .18), 2.05)); o = bpy.context.object; o.scale = (2.7, .045, .05); add(o, DARK)
    for k in range(9):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(fx + .03, -.62 + k * .155, zb_ + (zs_ - zb_) * .4)); o = bpy.context.object; o.scale = (.012, .018, .24); add(o, CHROME)
# Flugauto: schwebt, Antrieb leuchtet darunter
lift = .75 if c.get('fly') else 0
if lift:
    for wx in c['wh']:
        for s in (1, -1):
            bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=.2, depth=.02, location=(wx, s*.55, .1), rotation=(0, 0, 0))
            add(bpy.context.object, GLOW)
    li = bpy.data.lights.new('Antrieb', 'POINT'); li.energy = 140; li.color = (.5, .9, 1); lo = bpy.data.objects.new('Antrieb', li); lo.location = (L/2, 0, -.2); sc.collection.objects.link(lo)
    for o in parts: o.location.z += lift
    lo.location.z = lift - .3
    # Lichtkegel am Boden
    bpy.ops.mesh.primitive_circle_add(vertices=64, radius=1.6, fill_type='NGON', location=(L/2, 0, .002))
    o = bpy.context.object; o.scale = (1.1, .6, 1)
    gm = bpy.data.materials.new('Bodenlicht'); gm.use_nodes = True; gn = gm.node_tree.nodes; gn.remove(gn['Principled BSDF'])
    em = gn.new('ShaderNodeEmission'); em.inputs[0].default_value = (.4, .85, 1, 1); em.inputs[1].default_value = .6
    tr = gn.new('ShaderNodeBsdfTransparent'); mix = gn.new('ShaderNodeMixShader'); grad = gn.new('ShaderNodeTexGradient'); grad.gradient_type = 'SPHERICAL'
    tco = gn.new('ShaderNodeTexCoord'); mp = gn.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1, 1, 1)
    gm.node_tree.links.new(tco.outputs['Object'], grad.inputs[0]); gm.node_tree.links.new(grad.outputs[1], mix.inputs[0])
    gm.node_tree.links.new(tr.outputs[0], mix.inputs[1]); gm.node_tree.links.new(em.outputs[0], mix.inputs[2]); gm.node_tree.links.new(mix.outputs[0], gn['Material Output'].inputs[0])
    gm.blend_method = 'BLEND' if hasattr(gm, 'blend_method') else None
    o.data.materials.append(gm)

if OUT.endswith('.glb'):
    # 3D-Modell für die WebGL-Stadt: nur das Auto, Modifikatoren angewendet, Mitte auf null
    for o in sc.objects: o.location.x -= L/2
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_apply=True, export_yup=True)
    print('FERTIG', OUT); raise SystemExit
# Boden fängt nur den Schatten
bpy.ops.mesh.primitive_plane_add(size=30, location=(L/2, 0, 0)); fl = bpy.context.object; fl.is_shadow_catcher = True

# Studiolicht: große Softbox oben, Streiflicht seitlich, Kante von hinten
def area(name, loc, size, e, col=(1, 1, 1), sy=None):
    d = bpy.data.lights.new(name, 'AREA'); d.energy = e; d.color = col; d.shape = 'RECTANGLE'; d.size = size; d.size_y = sy or size
    o = bpy.data.objects.new(name, d); o.location = loc; sc.collection.objects.link(o)
    tt = o.constraints.new('TRACK_TO'); tt.target = body; tt.track_axis = 'TRACK_NEGATIVE_Z'; tt.up_axis = 'UP_Y'
area('Softbox', (L/2, 0, 6), 7, 420, (1, .98, .95), 2.2)
area('Seite', (L/2 + 1, 6, 2.2), 4, 160, (1, .95, .9), 1.2)
area('Front', (L + 5, 2, 1.8), 3, 110, (.9, .95, 1))
area('Kante', (-4, -3, 2.5), 3, 220, (1, .9, .8))

# Kamera: isometrisch wie in der Stadt, gleicher Maßstab für alle Stufen
cd = bpy.data.cameras.new('Cam'); cd.type = 'ORTHO'; cd.ortho_scale = 7.4
cam = bpy.data.objects.new('Cam', cd); sc.collection.objects.link(cam); sc.camera = cam
tgt = Vector((L/2, 0, .75)); dirv = Vector((1, 1, 1.0)).normalized()
cam.location = tgt + dirv * 30
tr_ = cam.constraints.new('TRACK_TO'); e = bpy.data.objects.new('Ziel', None); e.location = tgt; sc.collection.objects.link(e); tr_.target = e
tr_.track_axis = 'TRACK_NEGATIVE_Z'; tr_.up_axis = 'UP_Y'
if OUT.endswith('.blend'):
    # Nur speichern, damit man die Szene in Blender öffnen und drehen kann
    bpy.ops.wm.save_as_mainfile(filepath=OUT); print('FERTIG', OUT); raise SystemExit
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print('FERTIG', OUT)
