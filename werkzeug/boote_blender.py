# Glow City Boote: Superjacht, Motorjacht, Speedboot als Stadt-Sprites (zwei Fahrtrichtungen)
# Aufruf: Blender -b --factory-startup --python boote_blender.py -- <typ> <ordner> [samples]
import bpy, bmesh, math, sys
from mathutils import Vector
a = sys.argv[sys.argv.index('--') + 1:]
TYP, OUT = a[0], a[1]; SAMPLES = int(a[2]) if len(a) > 2 else 48
# L Länge, B Breite, H Rumpfhöhe über Wasser, Aufbauten als (x0, x1, Breite-Faktor, Höhe), Farbe Rumpfstreifen
BOOTE = {
 'super': dict(L=32, B=6.6, H=2.4, deck=[(5, 24, .8, 2.6), (8, 21, .7, 2.4), (11, 18, .58, 2.0)], streif=(0.85, 0.62, 0.18), unter=(0.02, 0.05, 0.16), ortho=40, res=(1100, 760), helipad=True),
 'motor': dict(L=18, B=4.6, H=1.7, deck=[(4, 13.5, .78, 2.2), (6.5, 12, .62, 1.8)], streif=(0.05, 0.75, 0.78), unter=(0.03, 0.08, 0.2), ortho=24, res=(820, 560)),
 'speed': dict(L=9, B=2.6, H=1.0, deck=[(3.6, 5.2, .7, .9)], streif=(1.0, 0.2, 0.55), unter=(1.0, 0.2, 0.55), ortho=12, res=(560, 380), offen=True),
}
c = BOOTE[TYP]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
try:
    pr = bpy.context.preferences.addons['cycles'].preferences; pr.compute_device_type = 'METAL'; pr.get_devices()
    for d in pr.devices: d.use = True
    sc.cycles.device = 'GPU'
except Exception: pass
sc.render.resolution_x, sc.render.resolution_y = c['res']
sc.render.film_transparent = True; sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Base Contrast'; sc.view_settings.exposure = .9
w = bpy.data.worlds.new('W'); sc.world = w; w.use_nodes = True; nt = w.node_tree; n = nt.nodes
bg = n['Background']; tc = n.new('ShaderNodeTexCoord'); sep = n.new('ShaderNodeSeparateXYZ'); ramp = n.new('ShaderNodeValToRGB')
nt.links.new(tc.outputs['Generated'], sep.inputs[0]); nt.links.new(sep.outputs['Z'], ramp.inputs[0]); nt.links.new(ramp.outputs[0], bg.inputs[0])
el = ramp.color_ramp.elements; el[0].position = .47; el[0].color = (.02, .05, .07, 1); el[1].position = .62; el[1].color = (.8, .78, .82, 1)
bg.inputs[1].default_value = .6

def mat(name, col, metal=0, rough=.3, coat=0, emis=None, es=0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = col + (1,); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    b.inputs['Coat Weight'].default_value = coat
    if emis: b.inputs['Emission Color'].default_value = emis + (1,); b.inputs['Emission Strength'].default_value = es
    return m
WEISS = mat('Rumpf', (.98, .98, .99), rough=.1, coat=1)
UNTER = mat('Unterrumpf', c['unter'], rough=.2, coat=1)
STREIF = mat('Streifen', c['streif'], rough=.2, coat=1)
TEAK = mat('Teak', (.62, .38, .18), rough=.45)
GLAS = mat('Glas', (.01, .02, .035), rough=.03, coat=1)
CHROM = mat('Chrom', (.9, .9, .92), metal=1, rough=.08)
POLSTER = mat('Polster', (.94, .9, .84), rough=.7)
LICHT = mat('Licht', (1, .9, .75), emis=(1, .85, .6), es=4)

L, B, H = c['L'], c['B'], c['H']
# Rumpf: Querschnitte entlang der Länge, Bug spitz, Heck breit
bm = bmesh.new(); N = 40; ring = []
for i in range(N + 1):
    x = L * i / N; t = x / L
    bb = B / 2 * (1 - max(0, (t - .55) / .45) ** 1.8 * .97)    # Bug läuft spitz zu
    hh = H * (1 + max(0, (t - .6)) * .5)                        # Bug etwas höher
    tief = -H * .55 * (1 - max(0, (t - .7) / .3) ** 2 * .6)
    pts = [(0, tief), (bb * .55, tief * .6), (bb * .92, 0), (bb, hh * .6), (bb * .98, hh), (0, hh)]
    ring.append([bm.verts.new((x, y, z)) for y, z in pts] + [bm.verts.new((x, -y, z)) for y, z in reversed(pts[1:-1])])
M = len(ring[0])
for i in range(N):
    for k in range(M):
        f = bm.faces.new((ring[i][k], ring[i + 1][k], ring[i + 1][(k + 1) % M], ring[i][(k + 1) % M]))
        f.material_index = 1 if k in (2, M - 3) else (2 if k in (0, 1, M - 2, M - 1) else 0)
bm.faces.new(list(reversed(ring[0]))); bm.faces.new(ring[-1])
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
me = bpy.data.meshes.new('Rumpf'); bm.to_mesh(me); bm.free()
rumpf = bpy.data.objects.new('Rumpf', me); sc.collection.objects.link(rumpf)
me.materials.append(WEISS); me.materials.append(STREIF); me.materials.append(UNTER)
sm = rumpf.modifiers.new('S', 'SUBSURF'); sm.levels = sm.render_levels = 2
for p in me.polygons: p.use_smooth = True
teile = [rumpf]
def box(x0, x1, bw, z0, h, m, bev=.25):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, 0, z0 + h / 2)); o = bpy.context.object
    o.scale = (x1 - x0, bw, h); bpy.ops.object.transform_apply(scale=True)
    bv = o.modifiers.new('B', 'BEVEL'); bv.width = bev; bv.segments = 4; o.data.materials.append(m); teile.append(o); return o
# Teakdeck
deckH = H * 1.0
box(.4, L * .78, B * .9, deckH - .05, .1, TEAK, .05)
# Aufbauten mit umlaufendem Fensterband
# Aufbauten schnittig: Front schräg nach hinten geneigt, oben schmaler, umlaufende getönte Scheiben, überstehendes Dach
def prisma(x0, x1, bw, z0, h, m, rake=1.4, schmal=.9, bev=.18):
    bm2 = bmesh.new(); xt = x1 - h * rake
    pts = [(x0, -bw / 2, z0), (x1, -bw / 2 * .8, z0), (x1, bw / 2 * .8, z0), (x0, bw / 2, z0), (x0 + .15, -bw / 2 * schmal, z0 + h), (xt, -bw / 2 * schmal * .78, z0 + h), (xt, bw / 2 * schmal * .78, z0 + h), (x0 + .15, bw / 2 * schmal, z0 + h)]
    v = [bm2.verts.new(p) for p in pts]
    for f in [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]: bm2.faces.new([v[i] for i in f])
    bmesh.ops.recalc_face_normals(bm2, faces=bm2.faces); me2 = bpy.data.meshes.new('Deck'); bm2.to_mesh(me2); bm2.free()
    o = bpy.data.objects.new('Deck', me2); sc.collection.objects.link(o); bv = o.modifiers.new('B', 'BEVEL'); bv.width = bev; bv.segments = 3; me2.materials.append(m)
    for pl in me2.polygons: pl.use_smooth = True
    teile.append(o); return o
z = deckH
for (x0, x1, bf, h) in c['deck']:
    bw = B * bf
    prisma(x0, x1, bw, z, h, WEISS)
    prisma(x0 + .1, x1 + .05, bw + .08, z + h * .3, h * .45, GLAS, rake=1.4 * h / (h * .45) * .45, schmal=.97, bev=.06)
    prisma(x0 - .6, x1 - h * 1.1, bw * 1.04, z + h - .02, .12, WEISS, rake=.2, schmal=1, bev=.04)
    z += h
if c.get('helipad'):
    box(1, 5, B * .7, deckH + .05, .08, mat('Pad', (.15, .15, .17), rough=.6), .02)
    bpy.ops.mesh.primitive_torus_add(major_radius=1.1, minor_radius=.08, location=(3, 0, deckH + .16)); o = bpy.context.object; o.data.materials.append(LICHT); teile.append(o)
if c.get('offen'):
    box(1.2, 3.4, B * .7, deckH, .6, POLSTER, .2)
    box(5.3, 5.5, B * .6, deckH + .9, .7, GLAS, .05)
POLSTER2 = mat('Kissen', c['streif'], rough=.6)
for i in range(3 if TYP != 'speed' else 1):
    box(L * .6 + i * (L * .06), L * .6 + i * (L * .06) + L * .045, B * .22, deckH + .05, .25, POLSTER2 if i % 2 == 0 else POLSTER, .08)
# Reling aus Chrom
for s_ in (1, -1):
    bpy.ops.mesh.primitive_cylinder_add(radius=.04, depth=L * .7, location=(L * .42, s_ * B * .44, deckH + .55), rotation=(0, math.pi / 2, 0)); o = bpy.context.object; o.data.materials.append(CHROM); teile.append(o)
# Positionslichter
box(L * .8, L * .82, .2, deckH + .2, .15, LICHT, .02)
# Mehr Details: dunkles Fensterband im Rumpf, Badeplattform, Sonnenliegen am Bug, Radarbogen
for s_ in (1, -1):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(L * .45, s_ * B * .495, H * .62)); o = bpy.context.object; o.scale = (L * .42, .04, H * .16); bpy.ops.object.transform_apply(scale=True); o.data.materials.append(GLAS); teile.append(o)
box(-.9, .4, B * .82, H * .25, .12, TEAK, .04)
if TYP != 'speed':
    for s_ in (1, -1):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(L * .7, s_ * B * .16, deckH + .18)); o = bpy.context.object; o.scale = (L * .1, B * .22, .22); bpy.ops.object.transform_apply(scale=True)
        bv = o.modifiers.new('B', 'BEVEL'); bv.width = .08; bv.segments = 3; o.data.materials.append(POLSTER); teile.append(o)
    top = z; x0 = c['deck'][-1][0]; x1 = c['deck'][-1][1]
    bpy.ops.mesh.primitive_torus_add(major_radius=B * .3, minor_radius=.1, location=(0, 0, 0)); o = bpy.context.object
    o.rotation_euler = (math.pi / 2, 0, 0); bpy.ops.object.transform_apply(rotation=True)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='DESELECT'); bpy.ops.object.mode_set(mode='OBJECT')
    for v in o.data.vertices: v.select = v.co.z < 0
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.delete(type='VERT'); bpy.ops.object.mode_set(mode='OBJECT')
    o.rotation_euler = (0, 0, math.pi / 2); bpy.ops.object.transform_apply(rotation=True); o.location = ((x0 + x1) / 2 - .5, 0, top - .05); o.data.materials.append(WEISS); teile.append(o)
if OUT.endswith('.glb'):
    # 3D-Modell für die WebGL-Stadt: nur das Boot, Mitte auf null, Bug zeigt nach +X
    for o in teile: o.location.x -= L / 2
    bpy.ops.object.select_all(action='DESELECT')
    for o in teile: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_apply=True, export_yup=True, use_selection=True)
    print('FERTIG', OUT); raise SystemExit
# Leichtes Wasser als Spiegel, nur Schatten und Reflexion
bpy.ops.mesh.primitive_plane_add(size=200, location=(L / 2, 0, -.05)); wa = bpy.context.object; wa.is_shadow_catcher = True

def area(name, loc, size, e, col=(1, 1, 1)):
    d = bpy.data.lights.new(name, 'AREA'); d.energy = e; d.color = col; d.size = size
    o = bpy.data.objects.new(name, d); o.location = loc; sc.collection.objects.link(o)
    tt = o.constraints.new('TRACK_TO'); tt.target = rumpf; tt.track_axis = 'TRACK_NEGATIVE_Z'; tt.up_axis = 'UP_Y'
area('Sonne', (L / 2 - 5, -8, 22), 18, 900 * (L / 18) ** 2, (1, .93, .85))
area('Himmel', (L / 2 + 10, 12, 14), 18, 380 * (L / 18) ** 2, (.85, .9, 1))
area('Gegen', (L / 2 - 14, 10, 12), 14, 260 * (L / 18) ** 2, (1, .85, .9))
# Boot in die Mitte schieben; für die Fahrtrichtungen dreht sich die Kamera um das Boot
for o in teile: o.location.x -= L / 2
wa.location.x -= L / 2
cd = bpy.data.cameras.new('Cam'); cd.type = 'ORTHO'; cd.ortho_scale = c['ortho']; cd.clip_end = 1000
cam = bpy.data.objects.new('Cam', cd); sc.collection.objects.link(cam); sc.camera = cam
ziel = bpy.data.objects.new('Ziel', None); sc.collection.objects.link(ziel); ziel.location = (0, 0, H * .8)
tr = cam.constraints.new('TRACK_TO'); tr.target = ziel; tr.track_axis = 'TRACK_NEGATIVE_Z'; tr.up_axis = 'UP_Y'
from mathutils import Matrix
for name, ang in (('90', 90), ('270', 270)):
    dirv = Matrix.Rotation(math.radians(-ang), 3, 'Z') @ Vector((1, 1, .816)).normalized()
    cam.location = ziel.location + dirv * 200; bpy.context.view_layer.update()
    sc.render.filepath = f'{OUT}/b_{TYP}_{name}.png'; bpy.ops.render.render(write_still=True)
print('FERTIG', TYP)
